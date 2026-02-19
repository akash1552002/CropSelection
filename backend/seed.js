const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Crop = require('./models/Crop');
const Schedule = require('./models/Schedule');
const Irrigation = require('./models/Irrigation');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/CropSelectionDB';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Read JSON files
        const cropsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/updated_combined_crop_data.json'), 'utf-8'));
        const scheduleData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/full_crop_daily_schedule.json'), 'utf-8'));
        const irrigationRawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/irrigation_data_detailed.json'), 'utf-8'));

        // Transform Irrigation Data (Object to Array)
        const irrigationData = Object.keys(irrigationRawData).map(key => ({
            crop_name: key,
            ...irrigationRawData[key]
        }));

        // Clear existing data
        await Crop.deleteMany({});
        await Schedule.deleteMany({});
        await Irrigation.deleteMany({});

        console.log('Existing data cleared');

        // Insert new data
        await Crop.insertMany(cropsData);
        console.log('Crops seeded');

        await Schedule.insertMany(scheduleData);
        console.log('Schedules seeded');

        await Irrigation.insertMany(irrigationData);
        console.log('Irrigation data seeded');

        console.log('All data seeded successfully');
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
