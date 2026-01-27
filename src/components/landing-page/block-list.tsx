"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Block } from "./types"
import { BlockItem } from "./block-item"

interface BlockListProps {
    blocks: Block[]
    onUpdate: (id: string, content: any) => void
    onRemove: (id: string) => void
}

export function BlockList({ blocks, onUpdate, onRemove }: BlockListProps) {
    return (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
                {blocks.map((block) => (
                    <BlockItem
                        key={block.id}
                        block={block}
                        onUpdate={onUpdate}
                        onRemove={onRemove}
                    />
                ))}
                {blocks.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                        <p className="text-sm text-muted-foreground">
                            No blocks added. Click a button below to start.
                        </p>
                    </div>
                )
                }
            </div >
        </SortableContext >
    )
}
