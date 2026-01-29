
import { Block, BlockType, LandingPageMetadata } from "@/components/landing-page/types";

// Helper to convert hex to rgb
// Helper to convert hex to rgb
export const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }; // Default to black if invalid
}

export const getPreviewStyles = (metadata: LandingPageMetadata) => {
    const bgColor = metadata.bgColor || '#29abe2';
    const rgb = hexToRgb(bgColor);


    // Basic CSS Reset & Variables
    const variables = `
        :root {
            --primary-color: #2563EB;
            --header-bg: ${bgColor};
            --text-main: #111;
            --text-sub: #555;
            --bg-color: #ffffff;
        }
    `;

    return `
        <style>
            ${variables}
            * {
                box-sizing: border-box;
            }
            body {
                margin: 0;
                padding: 0;
                font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
                background-color: var(--bg-color);
            }
            .landing-page-container {
                max-width: none;
                width: 100%;
                margin: 0;
                background-color: var(--bg-color);
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }
            
            /* Header Section */
            .header-section {
                background-color: var(--header-bg); /* Default fallback */
                width: 100%;
                height: 390px;
                padding: 0; /* Remove padding to allow image-container to define layout */
                position: relative;
                overflow: hidden;
            }
            .header-content {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
                max-width: 700px;
                height: 100%;
                z-index: 2; /* Content above image */
                padding: 248px 30px 70px 30px; 
                display: flex;
                flex-direction: column;
                align-items: center; /* Center horizontally */
                pointer-events: none; 
            }

            .header-title {
                align-self: stretch;
                color: #FFF;
                text-align: center;
                font-family: Pretendard, sans-serif;
                font-size: 28px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                margin: 0;
                white-space: pre-line;
            }
            .header-title:nth-of-type(2) {
                margin-bottom: 0px;
            }
            .header-period {
                color: #FFF;
                text-align: center;
                font-family: Pretendard, sans-serif;
                font-size: 15px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                margin-top: 6px;
                margin-bottom: 48px;
                display: block;
            }
            .header-image-container {
                width: 100%;
                height: 100%;
                padding-top: 32px;
                position: absolute; 
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1;
                display: flex;
                justify-content: center;
                box-sizing: border-box;
                max-width: 700px;
            }
            .header-image {
                width: 200px;
                height: 200px;
                object-fit: cover;
                display: block;
                margin-bottom: 158px;
            }
            


            /* Content Sections */
            .content-wrapper {
                padding: 0;
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 700px;
                margin: 20px auto 40px auto;
            }

            /* Main Text Block */
            .main-block {
                display: flex;
                padding: 20px 24px;
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
                align-self: stretch;
                width: 100%;
                box-sizing: border-box;
            }

            .main-block h2 {
                color: #191B1E;
                font-family: Pretendard, sans-serif;
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px;
                margin: 0;
            }
            .main-block .text-content {
                color: #22252A;
                font-family: Pretendard, sans-serif;
                font-size: 17px;
                font-style: normal;
                font-weight: 400;
                line-height: 26px;
                width: 100%;
                display: block;
            }
            .main-block .text-content p {
                margin: 0 0 15px 0;
            }
            .main-block .text-content p:last-child {
                margin-bottom: 0;
            }
            .main-block .text-content ul, .main-block .text-content ol {
                margin: 0 0 15px 0;
                padding-left: 20px;
            }
            .main-block .text-content li {
                margin-bottom: 5px;
            }
            .highlight {
                background-color: rgba(41, 171, 226, 0.15);
                font-weight: bold;
                padding: 0 2px;
            }

            /* Image Block */
            .image-block {
                margin: 0;
                display: flex;
                padding: 20px;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                align-self: stretch;
                width: 100%;
                box-sizing: border-box;
            }
            .image-block img {
                width: 100%;
                height: auto;
                object-fit: contain;
                border-radius: 4px;
                display: block;
            }
            .image-caption {
                color: #626A7A;
                font-family: Pretendard, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                margin-top: 8px;
            }

            /* Benefit List Block */
            /* Benefit List Block */
            .benefit-block {
                display: flex;
                padding: 20px;
                flex-direction: column;
                align-items: flex-start;
                gap: 20px;
                align-self: stretch;
                width: 100%;
                box-sizing: border-box;
            }
            .benefit-block h2 {
                align-self: stretch;
                color: #000;
                font-family: Pretendard, sans-serif;
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px;
                margin: 0;
            }
            .benefit-list {
                display: flex;
                flex-direction: column;
                gap: 32px;
            }
            .benefit-item {
                display: flex;
                flex-direction: column;
                gap: 14px;
                align-items: flex-start;
            }
            .benefit-header {
                display: flex;
                gap: 8px;
                align-items: flex-start;
                width: 100%;
            }
            .benefit-badge {
                width: 24px;
                height: 24px;
                background-color: #000;
                color: white;
                border-radius: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                flex-shrink: 0;
            }
            .benefit-header h3 {
                margin: 0;
                color: #22252A;
                font-family: Pretendard, sans-serif;
                font-size: 18px;
                font-weight: 700;
                line-height: 26px;
                flex: 1; /* Allow title to take up remaining space */
            }
            .benefit-item .text-content {
                align-self: stretch;
                color: #22252A;
                font-family: Pretendard, sans-serif;
                font-size: 17px;
                font-style: normal;
                font-weight: 400;
                line-height: 26px;
                word-break: keep-all;
            }
            .benefit-item .text-content p {
                margin: 0;
            }


            /* Rich Text Formatting */
            /* Rich Text Formatting */
            .main-block .text-content strong, .benefit-item .text-content strong,
            .main-block .text-content b, .benefit-item .text-content b {
                font-weight: 800;
                color: var(--text-main);
            }
            .main-block .text-content mark, .benefit-item .text-content mark {
                background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15);
                color: inherit;
                padding: 0 2px;
                border-radius: 2px;
            }
        </style>
    `;
}

export const generateHtml = (metadata: LandingPageMetadata, blocks: Block[], isPreview: boolean = false): string => {
    const styles = getPreviewStyles(metadata);

    const renderBlock = (block: Block) => {
        switch (block.type) {
            case 'main':
                const mainContent = block.content as any;
                // TipTap returns HTML, so we use it directly
                const processedContent = mainContent.content;

                return `
                    <div class="main-block" id="${block.id}">
                        <h2>${mainContent.title}</h2>
                        <div class="text-content">${processedContent}</div>
                    </div>
                `;
            case 'benefit':
                const benefitContent = block.content as any;
                return `
                    <div class="benefit-block" id="${block.id}">
                        <h2>${benefitContent.title}</h2>
                        <div class="benefit-list">
                            ${benefitContent.items.map((item: any, index: number) => `
                                <div class="benefit-item">
                                    <div class="benefit-header">
                                        ${item.subtitle ? `<div class="benefit-badge">${index + 1}</div>` : ''}
                                        <h3>${item.subtitle}</h3>
                                    </div>
                                    <div class="text-content">${item.content}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            case 'image':
                const imageContent = block.content as any;
                return `
                    <div class="image-block" id="${block.id}">
                        ${imageContent.imageUrl ? `<img src="${imageContent.imageUrl}" alt="Block image" />` : ''}
                        ${imageContent.caption ? `<div class="image-caption">${imageContent.caption}</div>` : ''}
                    </div>
                `;
            default:
                return '';
        }
    };

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title1}</title>
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
    ${styles}
    ${isPreview ? `
    <script>
        function saveScroll() {
            if (window.scrollY > 0) {
                window.name = window.scrollY.toString();
            }
        }
        window.addEventListener('scroll', saveScroll);
        window.addEventListener('beforeunload', saveScroll);

        document.addEventListener('DOMContentLoaded', () => {
            const savedScroll = parseInt(window.name || '0');
            if (savedScroll > 0) {
                window.scrollTo(0, savedScroll);
            }
        });
    </script>
    ` : ''}
</head>
<body>
    <div class="landing-page-container">
        <header class="header-section" style="background-color: ${metadata.bgColor || '#29abe2'};">
            <div class="header-image-container">
                ${metadata.imageUrl ? `<img src="${metadata.imageUrl}" class="header-image" alt="Header illustration" />` : ''}
            </div>
            <div class="header-content">
                <h1 class="header-title">${metadata.title1}</h1>
                <h1 class="header-title">${metadata.title2}</h1>
                <span class="header-period">${metadata.period}</span>
            </div>
        </header>

        <div class="content-wrapper">
            ${blocks.map(renderBlock).join('\n')}
        </div>
    </div>
</body>
</html>
    `.trim();
};
