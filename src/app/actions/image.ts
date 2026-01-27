"use server"

import { GoogleGenAI } from "@google/genai"

export async function generateBaseGeulImage(prompt: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { success: false, error: "API 키가 설정되지 않았습니다." }
        }

        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const response: any = await client.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        })

        if (response && response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64Image = part.inlineData.data;
                    return { success: true, imageUrl: `data:image/png;base64,${base64Image}` }
                }
            }
        }

        return { success: false, error: "이미지가 생성되지 않았습니다." }

    } catch (error: any) {
        console.error("Image generation error:", error)
        return { success: false, error: error.message || "이미지 생성 중 오류가 발생했습니다." }
    }
}
