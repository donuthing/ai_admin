"use server"

import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";


const ICON_PROMPT_TEMPLATE = `Create a simplified 3D {keyword} icon.

Tone:
friendly, clean, modern service illustration tone,
soft and approachable mood suitable for app UI
Object:
simplified 3D object,
rounded smooth shape,
slightly exaggerated proportions,
no sharp edges,
minimal details with a clear iconic silhouette
Composition:
single icon composition,
centered layout with sufficient spacing
Camera view:
fixed front-biased isometric view.
Camera is slightly above the object,
approximately 20–30 degrees downward tilt.
No rotation around the object.
Use the same camera angle across all images.
Lighting:
soft studio lighting applied to the object only,
background excluded from lighting.
Very soft shadow under the object only.
Material:
smooth matte plastic or silicone-like material,
clean surface, no texture patterns
Multi-object layout:
When multiple object keywords are provided,
arrange them as a single cohesive icon composition.
Use one primary object as the main focus.
Secondary objects should be smaller
and visually subordinate.
Group objects closely into a compact cluster.
Allow slight overlap or depth layering.
Avoid equal spacing or linear arrangements.
Background:
Use a single, solid, flat color background.
Background is a 2D UI layer, not a 3D environment.
The background must not be affected by lighting, shading, depth, or shadows.
No gradients, no vignetting,
no color variation, no lighting falloff.
Background color is automatically generated
based on the dominant color of the object.
Use a similar hue but darker or more muted.
Ensure sufficient contrast so that white text
is clearly readable on the background.
Do not use pure white or pure black.
Negative:
no photorealism,
no gradients,
no vignetting,
no background lighting,
no background shading,
no atmospheric effects,
no depth on background,
no metallic or glass materials,
no dramatic shadows,
no top-down view,
no side view,
no dynamic angle,
no perspective distortion,
no scattered layout,
no grid or list arrangement,
no floating isolated objects,
no text, no characters`;

const REFERENCE_DIR = path.join(process.cwd(), "public", "reference-images");

export async function generateBaseGeulImage(prompt: string) {
    try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const finalPrompt = ICON_PROMPT_TEMPLATE.replace(/{keyword}/g, prompt);

        // Gemini (Nano Banana) 모델로 이미지 생성
        // 레퍼런스 이미지를 포함한 parts 배열 구성
        const parts: any[] = [{ text: finalPrompt }];

        // 폴더 내 모든 이미지를 base64로 읽어서 inlineData로 추가
        try {
            const files = await fs.readdir(REFERENCE_DIR);
            const imageFiles = files.filter(f =>
                /\.(png|jpg|jpeg|webp)$/i.test(f)
            );
            for (const filename of imageFiles) {
                const filePath = path.join(REFERENCE_DIR, filename);
                const fileBuffer = await fs.readFile(filePath);
                const base64Data = fileBuffer.toString("base64");
                const ext = path.extname(filename).toLowerCase();
                const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
                    : ext === ".webp" ? "image/webp" : "image/png";
                parts.push({
                    inlineData: { mimeType, data: base64Data },
                });
            }
            if (imageFiles.length > 0) {
                parts.push({ text: "위 레퍼런스 이미지들의 스타일을 참고하여 동일한 톤과 질감으로 생성해주세요." });
            }
        } catch (err) {
            console.warn("레퍼런스 이미지 폴더 읽기 실패:", err);
        }

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{ role: "user", parts }],
            config: {
                responseModalities: ['IMAGE'],
                imageConfig: {
                    aspectRatio: '4:3',
                },
            } as any
        });

        // 응답에서 이미지 데이터 추출
        const candidates = (response as any).candidates;
        if (candidates && candidates.length > 0) {
            const parts = candidates[0].content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData) {
                        let imageBytes = part.inlineData.data;

                        const mimeType = part.inlineData.mimeType || 'image/png';
                        const imageUrl = `data:${mimeType};base64,${imageBytes}`;
                        return { success: true, imageUrl: imageUrl };
                    }
                }
            }
        }

        return { success: false, error: "이미지 데이터가 없습니다." };

    } catch (error: any) {
        console.error("Gemini Image API Error:", error);
        return { success: false, error: error.message };
    }
}

