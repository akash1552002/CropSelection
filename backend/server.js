const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Crop = require('./models/Crop');
const Schedule = require('./models/Schedule');
const Irrigation = require('./models/Irrigation');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// ...

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/CropSelectionDB')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// API Routes

// Get all crops
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific crop by name
app.get('/api/crops/:name', async (req, res) => {
    try {
        const crop = await Crop.findOne({ crop_name: req.params.name });
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.json(crop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get schedule for a crop
app.get('/api/schedules/:cropName', async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ crop_name: req.params.cropName });
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get irrigation data for a crop
app.get('/api/irrigation/:cropName', async (req, res) => {
    try {
        const irrigation = await Irrigation.findOne({ crop_name: req.params.cropName });
        if (!irrigation) return res.status(404).json({ message: 'Irrigation data not found' });
        res.json(irrigation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
