"use client"

import { BaseEditor } from "@/components/landing-page/base-editor"
import { BlockType, LandingPageMetadata } from "@/components/landing-page/types"

const INITIAL_METADATA: LandingPageMetadata = {
    title1: "",
    title2: "",
    bgColor: "#123456",
    imageUrl: "",
    period: ""
}

const AVAILABLE_BLOCKS: BlockType[] = ['main', 'benefit', 'image']

export function KGonggamEditor() {
    return (
        <BaseEditor
            initialMetadata={INITIAL_METADATA}
            availableBlocks={AVAILABLE_BLOCKS}
        />
    )
}
