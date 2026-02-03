"use server"

import { GoogleGenAI } from "@google/genai";

export async function generateBaseGeulImage(prompt: string) {
    try {
        const project = process.env.GCP_PROJECT_ID;

        const client = new GoogleGenAI({
            vertexai: true, // 300$ 크레딧 사용 필수 옵션
            project: project,
            location: 'us-central1' // 이미지 생성에 가장 안정적인 리전
        });

        // ✅ 모델 이름을 -001 버전으로 변경하여 호출합니다.
        const response = await client.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: "1:1",
            }
        });

        if (response?.generatedImages?.length > 0) {
            const image = response.generatedImages[0].image;
            const imageBytes = image.imageBytes || image.bytes;
            return { success: true, imageUrl: `data:image/png;base64,${imageBytes}` };
        }

        return { success: false, error: "이미지 데이터가 없습니다." };

    } catch (error: any) {
        console.error("Imagen API Error:", error);
        // 에러 메시지에 404가 계속 뜬다면 'Vertex AI API' 활성화 여부를 다시 체크해야 합니다.
        return { success: false, error: error.message };
    }
}
