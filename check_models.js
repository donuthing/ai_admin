
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function listModels() {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await client.models.list();
        console.log("Found models:");
        let found = false;
        for await (const model of response) {
            if (model.name.includes('imagen-3.0')) {
                console.log(JSON.stringify(model, null, 2));
                found = true;
            }
        }
        if (!found) console.log("No imagen-3.0 models found.");
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
