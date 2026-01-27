"use server"

import { GoogleGenAI } from "@google/genai"

export async function generateBaseGeulImage(prompt: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { success: false, error: "API 키가 설정되지 않았습니다." }
        }

        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        // Imagen model configuration
        const response: any = await client.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: "image/png"
            }
        })

        if (response && response.generatedImages && response.generatedImages.length > 0) {
            const image = response.generatedImages[0]
            if (image.image && image.image.imageBytes) {
                return {
                    success: true,
                    imageUrl: `data:image/png;base64,${image.image.imageBytes}`
                }
            }
        }

        return { success: false, error: "이미지 생성에 실패했습니다. (응답 없음)" }

    } catch (error: any) {
        console.error("Gemini Image Generation Error:", error)
        return {
            success: false,
            error: error.message || "이미지 생성 중 오류가 발생했습니다."
        }
    }
}
