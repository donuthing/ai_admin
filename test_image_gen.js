
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function testImageGen() {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'imagen-4.0-generate-001';

    try {
        const response = await client.models.generateImages({
            model: model,
            prompt: "A cute robot eating a donut",
            config: { numberOfImages: 1 }
        });
        // Inspect structure
        if (response.generatedImages && response.generatedImages.length > 0) {
            const imgObj = response.generatedImages[0];
            console.log("Image Object Keys:", Object.keys(imgObj));
            if (imgObj.image) {
                console.log("imgObj.image Keys:", Object.keys(imgObj.image));
                // Check if it has imageBytes
                if (imgObj.image.imageBytes) console.log("Has imageBytes (length):", imgObj.image.imageBytes.length);
            }
        } else {
            console.log("No generated images found in response.");
        }
    } catch (e) {
        console.log("Failed:", e.message);
    }
}

testImageGen();
