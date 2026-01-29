"use client"

import { BaseEditor } from "@/components/landing-page/base-editor"
import { BlockType, LandingPageMetadata } from "@/components/landing-page/types"

const AVAILABLE_BLOCKS: BlockType[] = ['main', 'benefit', 'image']

const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
}

export function KGonggamEditor() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const initialMetadata: LandingPageMetadata = {
        title1: "제목을 입력하면",
        title2: "이렇게 보여요",
        bgColor: "#1FA4D7",
        imageUrl: "https://cdn.paybooc.co.kr/cbf/bannerimage/PMB0103999/main_image_sample1.png",
        period: `${formatDate(today)} - ${formatDate(tomorrow)}`
    }

    const defaultBlockContent = {
        main: {
            title: "내용을 입력해 주세요",
            content: "자세히 설명해주세요. 텍스트를 드래그하면 <b>볼드</b> 및 <mark>강조처리</mark>를 할 수 있어요."
        }
    }

    return (
        <BaseEditor
            availableBlocks={AVAILABLE_BLOCKS}
            initialMetadata={initialMetadata}
            defaultBlockContent={defaultBlockContent}
        />
    )
}
