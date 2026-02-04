"use server"

import { GoogleGenAI } from "@google/genai";

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
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-calculator.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-calendar2.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-cellphone.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-clock.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-coin3.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-money1.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-money2.png" },
    { gcsUri: "gs://bc_k0gam_kv_v1/img-3d-travelbag.png" }
];

export async function generateBaseGeulImage(prompt: string, useIconGuide: boolean = false) {
    try {
        const project = process.env.GCP_PROJECT_ID;

        const client = new GoogleGenAI({
            vertexai: true, // 300$ 크레딧 사용 필수 옵션
            project: project,
            location: 'us-central1' // 이미지 생성에 가장 안정적인 리전
        });

        let finalPrompt = prompt;
        // @ts-ignore
        let generationConfig: any = {
            numberOfImages: 1,
            aspectRatio: "1:1",
        };

        if (useIconGuide) {
            finalPrompt = ICON_PROMPT_TEMPLATE.replace(/{keyword}/g, prompt);
            // ✅ 레퍼런스 이미지 설정 (모델이 이 이미지들의 재질/조명을 따라하게 됨)
            generationConfig.image_input = REFERENCE_IMAGES;
        }

        // ✅ 모델 이름을 -001 버전으로 변경하여 호출합니다.
        const response = await client.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: finalPrompt,
            config: generationConfig
        });

        if (response?.generatedImages && response.generatedImages.length > 0) {
            const image = response.generatedImages[0].image;
            if (image) {
                const imageBytes = image.imageBytes || (image as any).bytes;
                return { success: true, imageUrl: `data:image/png;base64,${imageBytes}` };
            }
        }

        return { success: false, error: "이미지 데이터가 없습니다." };

    } catch (error: any) {
        console.error("Imagen API Error:", error);
        // 에러 메시지에 404가 계속 뜬다면 'Vertex AI API' 활성화 여부를 다시 체크해야 합니다.
        return { success: false, error: error.message };
    }
}
