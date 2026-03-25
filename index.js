process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // 보안 검사 비활성화

const { Client } = require("@notionhq/client");
const fs = require("fs"); // 파일을 저장하기 위한 도구
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageId = process.env.NOTION_PAGE_ID;

// 텍스트 내용 가져오기 및 스타일 적용
const richTextToHtml = (richTexts) => {
  if (!richTexts) return "";

  return richTexts.map(t => {
    let style = "";
    if (t.annotations.color && t.annotations.color !== "default") {
      if (t.annotations.color.includes("_background")) {
        style += `background-color: var(--notion-${t.annotations.color});`;
      } else {
        style += `color: var(--notion-${t.annotations.color});`;
      }
    }
    return style ? `<span style="${style}">${t.plain_text}</span>` : t.plain_text;
  }).join("");
};

// 블록들을 HTML 문자열로 변환하는 비동기 재귀 함수
async function blocksToHtml(blocks) {
  let html = [];
  for (const block of blocks) {
    const blockHtml = await blockToHtml(block);
    html.push(blockHtml);
  }
  return html.join("\n");
}

// 노션 블록을 HTML 태그로 바꾸는 함수
async function blockToHtml(block) {
  const { type } = block;
  const value = block[type];

  // 텍스트가 없는 빈 줄 처리
  if (value.rich_text && value.rich_text.length === 0) return "<br/>";

  const text = richTextToHtml(value.rich_text);

  switch (type) {
    case "heading_1": return `<h1>${text}</h1>`;
    case "heading_2": return `<h2>${text}</h2>`;
    case "paragraph": return `<p>${text}</p>`;
    case "bulleted_list_item": {
      let itemHtml = `<li>${text}</li>`;
      if (block.has_children) {
        const children = await notion.blocks.children.list({ block_id: block.id });
        const childrenHtml = await blocksToHtml(children.results);
        itemHtml = `<li>${text}<ul>${childrenHtml}</ul></li>`;
      }
      return itemHtml;
    }
    case "divider": return `<hr/>`;
    case "callout": {
      const calloutText = richTextToHtml(value.rich_text);
      const icon = value.icon.emoji || "💡"; // Default icon
      return `<div class="callout"><span class="callout-icon">${icon}</span><span>${calloutText}</span></div>`;
    }
    case "image": {
      // 1. 이미지 URL 추출 (외부 링크 vs 노션 직접 업로드)
      const imageUrl = value.type === "external" ? value.external.url : value.file.url;
      
      // 2. 캡션(설명) 추출
      const caption = value.caption ? richTextToHtml(value.caption) : "";
      
      return `
        <figure class="notion-image">
          <img src="${imageUrl}" alt="${caption || '노션 이미지'}" style="max-width: 100%; height: auto;">
          ${caption ? `<figcaption>${caption}</figcaption>` : ""}
        </figure>
      `;
    }
    default: return ``;
  }
}

async function main() {
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    const blocks = response.results;

    // 1. 블록들을 HTML 문자열로 변환
    const htmlContent = await blocksToHtml(blocks);

    // 2. 전체 HTML 구조와 디자인(CSS) 입히기
    const fullHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>노션 변환 서비스</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    // 3. 파일로 저장
    fs.writeFileSync("output.html", fullHtml);
    console.log("✅ 성공! output.html 파일이 생성되었습니다.");

  } catch (error) {
    console.error("오류 발생:", error);
  }
}

main();
