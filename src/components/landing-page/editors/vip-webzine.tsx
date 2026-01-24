"use client"

import { BaseEditor } from "@/components/landing-page/base-editor"
import { BlockType, LandingPageMetadata } from "@/components/landing-page/types"

const INITIAL_METADATA: LandingPageMetadata = {
    title1: "",
    title2: "",
    bgColor: "#333333", // Different default background
    imageUrl: "",
    period: ""
}

const AVAILABLE_BLOCKS: BlockType[] = ['main', 'benefit', 'image'] // VIP might have different blocks later

export function VipWebzineEditor() {
    return (
        <BaseEditor
            initialMetadata={INITIAL_METADATA}
            availableBlocks={AVAILABLE_BLOCKS}
        />
    )
}
