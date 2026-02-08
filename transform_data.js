const fs = require('fs');
const path = require('path');

const inputPath = 'c:\\Users\\Akashpr\\OneDrive\\Desktop\\crop\\CropSelection\\assets\\full_crop_daily_schedule.json';

try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const crops = JSON.parse(rawData);

    const transformedCrops = crops.map(crop => {
        const dailySchedule = crop.daily_schedule;
        const weeks = [];

        // Group by week
        const tasksByWeek = {};

        dailySchedule.forEach(task => {
            const weekNum = Math.ceil(task.day / 7);
            if (!tasksByWeek[weekNum]) {
                tasksByWeek[weekNum] = [];
            }
            tasksByWeek[weekNum].push(task);
        });

        // Convert to array
        Object.keys(tasksByWeek).sort((a, b) => parseInt(a) - parseInt(b)).forEach(weekNum => {
            weeks.push({
                week: parseInt(weekNum),
                tasks: tasksByWeek[weekNum]
            });
        });

        return {
            ...crop,
            weeks: weeks,
            daily_schedule: undefined // Remove the old flat list
        };
    });

    fs.writeFileSync(inputPath, JSON.stringify(transformedCrops, null, 2));
    console.log('Successfully transformed crop data to weekly format.');

} catch (error) {
    console.error('Error transforming data:', error);
}
