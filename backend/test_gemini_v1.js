const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const m = "gemini-1.5-flash";

    try {
        console.log(`Testing model ${m} with v1 API...`);
        // Note: The second argument is for TaskOptions/RequestOptions
        const model = genAI.getGenerativeModel({ model: m }, { apiVersion: "v1" });
        const result = await model.generateContent("Hi");
        console.log(`SUCCESS with v1: ${result.response.text()}`);
    } catch (e) {
        console.error(`FAILED with v1: ${e.message}`);
    }
}

test();
