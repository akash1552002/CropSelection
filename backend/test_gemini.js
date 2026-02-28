const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-pro", "models/gemini-pro"];

    for (const m of models) {
        try {
            console.log(`Testing model: ${m}`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hi");
            console.log(`SUCCESS for ${m}: ${result.response.text()}`);
            break;
        } catch (e) {
            console.error(`FAILED for ${m}: ${e.message}`);
        }
    }
}

test();
