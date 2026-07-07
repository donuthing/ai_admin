export type BlockType = 'main' | 'benefit' | 'image';

export interface MainBlockContent {
    title: string;
    content: string;
}

export interface BenefitItemContent {
    subtitle: string;
    content: string;
}

export interface BenefitBlockContent {
    title: string;
    items: BenefitItemContent[];
}

export interface ImageBlockContent {
    imageUrl: string;
    caption: string;
}

export interface LandingButton {
    name: string;
    landingType: 'screenId' | 'url';
    url: string;
    params?: string;
}

export interface LandingPageMetadata {
    title1: string;
    title2: string;
    bgColor: string;
    imageUrl?: string;
    // 플로팅 버튼 목록. 배열 순서상 첫 번째가 화면 우측, 이후 좌측으로 배치됨.
    buttons?: LandingButton[];
}

export interface Block {
    id: string;
    type: BlockType;
    content: MainBlockContent | BenefitBlockContent | ImageBlockContent;
}
