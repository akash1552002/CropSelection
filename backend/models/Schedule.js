const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    crop_name: { type: String, required: true, unique: true },
    growthDuration: Number,
    weeks: [{
        week: Number,
        tasks: [{
            day: Number,
            task: String,
            category: String
        }]
    }]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
