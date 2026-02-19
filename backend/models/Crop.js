const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    crop_name: { type: String, required: true, unique: true },
    best_regions: [String],
    sunlight: String,
    water_needs: String,
    soil_type: [String],
    ph_level: String,
    temperature: String,
    pests: [String],
    diseases: [{
        name: String,
        type: { type: String },
        symptoms: [String],
        prevention: [String]
    }],
    market_price: String,
    demand: String,
    export_countries: [String],
    growth_cycle: {
        growthDuration: Number,
        growthStages: [{
            stage: String,
            day: Number,
            activity: String,
            alert: String
        }]
    },
    farming_tips: [String],
    irrigation: mongoose.Schema.Types.Mixed, // Can be string or object
    image: String,
    icon: String
});

module.exports = mongoose.model('Crop', CropSchema);
