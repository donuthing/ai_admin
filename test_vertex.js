
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function testVertex() {
    const project = process.env.GCP_PROJECT_ID;
    const location = 'us-central1';

    console.log(`Testing Vertex AI with Project: ${project}, Location: ${location}`);
    console.log(`Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

    const client = new GoogleGenAI({
        vertexai: true,
        project: project,
        location: location
    });

    try {
        console.log("Generating image...");
        const response = await client.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: "A cute robot eating a donut",
            config: { numberOfImages: 1 }
        });
        console.log("Response received:", response);
    } catch (error) {
        console.error("Error generating image:", error);
    }
}

testVertex();
