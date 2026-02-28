const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1/models?key=${apiKey}`,
    method: 'GET'
};

console.log(`Listing models via ${options.path}...`);

const req = https.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', d => {
        data += d;
    });
    res.on('end', () => {
        console.log(data);
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
