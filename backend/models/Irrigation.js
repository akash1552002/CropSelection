const mongoose = require('mongoose');

const IrrigationSchema = new mongoose.Schema({
    crop_name: { type: String, required: true, unique: true },
    water_requirements: String,
    irrigation_method: String,
    recommended_frequency: String,
    seasonal_adjustments: String
});

module.exports = mongoose.model('Irrigation', IrrigationSchema);
