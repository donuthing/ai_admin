"use server"

import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";


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
Ensure sufficient contrast so that white text (FFFFFF_1)
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

const REFERENCE_IMAGES = [
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-cellphone.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-clock.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-coin3.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-money1.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-money2.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-travelbag.png" }
];

export async function generateBaseGeulImage(prompt: string, useIconGuide: boolean = false) {
    try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        let finalPrompt = prompt;
        // @ts-ignore
        let generationConfig: any = {
            numberOfImages: 1,
            aspectRatio: "4:3",
        };

        if (useIconGuide) {
            finalPrompt = ICON_PROMPT_TEMPLATE.replace(/{keyword}/g, prompt);
            // ✅ 레퍼런스 이미지 설정 (모델이 이 이미지들의 재질/조명을 따라하게 됨)
            generationConfig.image_input = REFERENCE_IMAGES;
        }

        // ✅ 모델 이름을 -001 버전으로 변경하여 호출합니다.
        const response = await client.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: generationConfig
        });

        if (response?.generatedImages && response.generatedImages.length > 0) {
            const image = response.generatedImages[0].image;
            if (image) {
                let imageBytes = (image as any).imageBytes;

                // 2. Zoom Image (Crop Center & Resize) - 1.2x zoom
                try {
                    const buffer = Buffer.from(imageBytes, 'base64');
                    const zoomedBuffer = await zoomImage(buffer, 1.2);
                    imageBytes = zoomedBuffer.toString('base64');
                } catch (zoomError) {
                    console.error("Image zooming failed, using original image:", zoomError);
                }

                // 3. Remove Background (if API key exists)
                if (process.env.REMOVE_BG_API_KEY) {
                    try {
                        imageBytes = await removeBackground(imageBytes);
                    } catch (bgError) {
                        console.error("Background removal failed, using original image:", bgError);
                        // Continue with original image
                    }
                }

                // Return URL path
                const imageUrl = `data: image/png;base64,${imageBytes}`;
                return { success: true, imageUrl: imageUrl };
            }
        }

        return { success: false, error: "이미지 데이터가 없습니다." };

    } catch (error: any) {
        console.error("Imagen API Error:", error);
        // 에러 메시지에 404가 계속 뜬다면 'Vertex AI API' 활성화 여부를 다시 체크해야 합니다.
        return { success: false, error: error.message };
    }
}

async function removeBackground(base64Image: string): Promise<string> {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
            "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            image_file_b64: base64Image,
            size: "auto",
            format: "png"
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Remove.bg API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.data.result_b64;
}

async function zoomImage(imageBuffer: Buffer, zoomFactor: number): Promise<Buffer> {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error("Invalid image metadata");
    }

    const width = metadata.width;
    const height = metadata.height;
    const cropWidth = Math.floor(width / zoomFactor);
    const cropHeight = Math.floor(height / zoomFactor);
    const left = Math.floor((width - cropWidth) / 2);
    const top = Math.floor((height - cropHeight) / 2);

    return await image
        .extract({ left, top, width: cropWidth, height: cropHeight })
        .resize(width, height)
        .toBuffer();
}
