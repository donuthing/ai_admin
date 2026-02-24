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

export interface LandingPageMetadata {
    title1: string;
    title2: string;
    bgColor: string;
    imageUrl?: string;
    useButton?: boolean;
    buttonName?: string;
    buttonLandingType?: 'screenId' | 'url';
    buttonUrl?: string;
}

export interface Block {
    id: string;
    type: BlockType;
    content: MainBlockContent | BenefitBlockContent | ImageBlockContent;
}
