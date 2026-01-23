
import { Block, BlockType, LandingPageMetadata } from "@/components/landing-page/types";

export const generateHtml = (metadata: LandingPageMetadata, blocks: Block[]): string => {
    // Basic CSS Reset & Variables
    const variables = `
        :root {
            --primary-color: #2563EB;
            --header-bg: #29abe2;
            --text-main: #111;
            --text-sub: #555;
            --bg-color: #ffffff;
        }
    `;

    const styles = `
        <style>
            ${variables}
            body {
                margin: 0;
                padding: 0;
                font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
                background-color: #eee; /* Outer background */
            }
            .landing-page-container {
                max-width: 480px; /* Mobile-first width preference */
                margin: 0 auto;
                background-color: var(--bg-color);
                min-height: 100vh;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                position: relative;
                overflow-x: hidden;
            }
            
            /* Header Section */
            .header-section {
                background-color: var(--header-bg); /* Default fallback */
                padding: 40px 30px;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .header-content {
                position: relative;
                z-index: 2;
            }

            .header-title {
                font-size: 32px;
                font-weight: 800;
                line-height: 1.2;
                margin: 0 0 5px 0;
                white-space: pre-line;
            }
            .header-period {
                font-size: 14px;
                opacity: 0.8;
                margin-top: 10px;
                display: block;
            }
            .header-image-container {
                text-align: right;
                margin-top: -20px;
                margin-right: -30px;
                position: relative;
                z-index: 1;
            }
            .header-image {
                max-width: 200px;
                height: auto;
            }

            /* Content Sections */
            .content-wrapper {
                padding: 40px 24px;
                display: flex;
                flex-direction: column;
                gap: 40px;
            }

            /* Main Text Block */
            .main-block h2 {
                font-size: 22px;
                font-weight: 800;
                margin: 0 0 15px 0;
                color: var(--text-main);
            }
            .main-block .text-content {
                font-size: 15px;
                line-height: 1.6;
                color: #333;
                word-break: keep-all;
            }
            .main-block .text-content p {
                margin: 0 0 15px 0;
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
                margin: 10px 0;
            }
            .image-block img {
                width: 100%;
                border-radius: 4px;
                display: block;
            }
            .image-caption {
                font-size: 11px;
                color: #999;
                margin-top: 8px;
            }

            /* Benefit List Block */
            .benefit-block h2 {
                font-size: 20px;
                font-weight: 800;
                margin: 0 0 20px 0;
                color: var(--text-main);
            }
            .benefit-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .benefit-item {
                display: flex;
                gap: 12px;
                align-items: flex-start;
            }
            .benefit-badge {
                min-width: 24px;
                height: 24px;
                background-color: #000;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .benefit-content h3 {
                margin: 0 0 6px 0;
                font-size: 16px;
                font-weight: 800;
                color: #000;
            }
            .benefit-content .text-content {
                font-size: 14px;
                line-height: 1.5;
                color: #444;
                word-break: keep-all;
            }
            .benefit-content .text-content p {
                margin: 0;
            }


            /* Rich Text Formatting */
            .main-block .text-content strong, .benefit-content .text-content strong {
                font-weight: 800;
                color: var(--text-main);
            }
            .main-block .text-content mark, .benefit-content .text-content mark {
                background-color: rgba(41, 171, 226, 0.2);
                color: inherit;
                padding: 0 2px;
                border-radius: 2px;
            }
        </style>
    `;

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
                                    <div class="benefit-badge">${index + 1}</div>
                                    <div class="benefit-content">
                                        <h3>${item.subtitle}</h3>
                                        <div class="text-content">${item.content}</div>
                                    </div>
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
</head>
<body>
    <div class="landing-page-container">
        <header class="header-section" style="background-color: ${metadata.bgColor || '#29abe2'};">
            <div class="header-content">

                <h1 class="header-title">${metadata.title1}</h1>
                <h1 class="header-title">${metadata.title2}</h1>
                <span class="header-period">${metadata.period}</span>
            </div>
            ${metadata.imageUrl ? `
            <div class="header-image-container">
                <img src="${metadata.imageUrl}" class="header-image" alt="Header illustration" />
            </div>
            ` : ''}
        </header>

        <div class="content-wrapper">
            ${blocks.map(renderBlock).join('\n')}
        </div>
    </div>
</body>
</html>
    `.trim();
};
