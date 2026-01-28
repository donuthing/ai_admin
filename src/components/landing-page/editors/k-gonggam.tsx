"use client"

import { BaseEditor } from "@/components/landing-page/base-editor"
import { BlockType, LandingPageMetadata } from "@/components/landing-page/types"

const AVAILABLE_BLOCKS: BlockType[] = ['main', 'benefit', 'image']

export function KGonggamEditor() {
    return (
        <BaseEditor
            availableBlocks={AVAILABLE_BLOCKS}
        />
    )
}
