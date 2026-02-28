const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const Crop = require('./models/Crop');
const Schedule = require('./models/Schedule');
const Irrigation = require('./models/Irrigation');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/CropSelectionDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Diagnosis Endpoint
app.post('/api/diagnose', upload.single('image'), async (req, res) => {
    console.log("DEBUG: Received diagnosis request");
    try {
        if (!req.file) {
            console.error("DEBUG: No file in request");
            return res.status(400).json({ message: 'No image provided' });
        }
        console.log(`DEBUG: File received: ${req.file.originalname} (${req.file.size} bytes)`);

        const prompt = `
            Analyze this plant leaf image for diseases. 
            Return ONLY a valid JSON object with these exact keys:
            "diseaseName" (string), 
            "confidence" (number between 0-1), 
            "description" (string), 
            "treatment" (array of strings), 
            "isHealthy" (boolean).
        `;

        // Updated model list based on available models from listModels
        const modelNames = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"];
        let diagnosisSuccess = false;
        let lastError = null;

        for (const modelName of modelNames) {
            try {
                console.log(`DEBUG: Attempting diagnosis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const imagePart = {
                    inlineData: {
                        data: req.file.buffer.toString("base64"),
                        mimeType: req.file.mimetype
                    }
                };

                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                const text = response.text();

                // Clean JSON response (strip markdown backticks if present)
                const jsonString = text.replace(/```json|```/g, "").trim();
                res.json(JSON.parse(jsonString));
                diagnosisSuccess = true;
                console.log(`DEBUG: Diagnosis successful with model: ${modelName}`);
                break; // Exit loop on success
            } catch (error) {
                console.warn(`DEBUG: Model ${modelName} failed:`, error.message);
                lastError = error;

                // If the error is a rate limit (429), we might want to wait or just try next model
                if (error.message.includes("429") || error.message.includes("quota")) {
                    console.log("DEBUG: Quota exceeded, moving to next model...");
                }
            }
        }

        if (!diagnosisSuccess) {
            throw lastError || new Error("All models failed");
        }

    } catch (error) {
        console.error("DEBUG: Gemini Diagnosis Failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        res.status(500).json({
            message: "AI diagnosis failed",
            error: error.message,
            details: error.name
        });
    }
});

// Existing Routes
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/crops/:name', async (req, res) => {
    try {
        const crop = await Crop.findOne({ crop_name: req.params.name });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.json(crop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/schedules/:cropName', async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ crop_name: req.params.cropName });
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/irrigation/:cropName', async (req, res) => {
    try {
        const irrigation = await Irrigation.findOne({ crop_name: req.params.cropName });
        if (!irrigation) return res.status(404).json({ message: 'Irrigation data not found' });
        res.json(irrigation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} and binding to 0.0.0.0`);
});