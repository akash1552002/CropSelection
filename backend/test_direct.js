const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const data = JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Testing direct HTTPS request to ${options.path}...`);

const req = https.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
