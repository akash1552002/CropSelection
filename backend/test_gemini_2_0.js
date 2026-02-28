const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const m = "gemini-2.0-flash";

    try {
        console.log(`Testing model ${m}...`);
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hi");
        console.log(`SUCCESS: ${result.response.text()}`);
    } catch (e) {
        console.error(`FAILED: ${e.message}`);
    }
}

test();
