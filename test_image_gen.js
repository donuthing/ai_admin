
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '.env.local' });

async function testImageGen() {
    console.log("Starting test with API Key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "MISSING");
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        console.log("Calling generateImages with imagen-4.0-generate-001...");
        const response = await client.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: "A cute robot eating a donut",
            config: { numberOfImages: 1 }
        });

        console.log("Response received.");

        if (response && response.generatedImages && response.generatedImages.length > 0) {
            const imgObj = response.generatedImages[0];
            const image = imgObj.image;

            if (image) {
                console.log("Image object found. Keys:", Object.keys(image));
                if (image.imageBytes) console.log("Found image.imageBytes!");
                if (image.bytes) console.log("Found image.bytes!");

                // Inspect values
                for (const key of Object.keys(image)) {
                    const val = image[key];
                    console.log(`Key: ${key}, Type: ${typeof val}, IsBuffer: ${Buffer.isBuffer(val)}`);
                    if (typeof val === 'string') console.log(`  Length: ${val.length}, Prefix: ${val.substring(0, 20)}`);
                }
            } else {
                console.log("imgObj.image is missing");
            }
        } else {
            console.log("No generated images found in response.");
        }
    } catch (e) {
        console.log("Failed:", e.message);
    }
}

testImageGen();
