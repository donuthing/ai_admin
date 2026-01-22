"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Block, BlockType, LandingPageMetadata } from "./types"
import { BlockList } from "./block-list"
import { MetadataForm } from "./metadata-form"

export function LandingPageEditor() {
    const [metadata, setMetadata] = useState<LandingPageMetadata>({
        title1: "",
        title2: "",
        bgColor: "#ffffff",
        imageUrl: "",
        period: ""
    })
    const [blocks, setBlocks] = useState<Block[]>([])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleAddBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type,
            content: type === 'main'
                ? { title: "", content: "" }
                : type === 'benefit'
                    ? { title: "", items: [{ subtitle: "", content: "" }] }
                    : { imageUrl: "", caption: "" },
        }
        setBlocks((prev) => [...prev, newBlock])
    }

    const handleUpdateBlock = (id: string, content: any) => {
        setBlocks((prev) =>
            prev.map((block) =>
                block.id === id ? { ...block, content } : block
            )
        )
    }

    const handleRemoveBlock = (id: string) => {
        setBlocks((prev) => prev.filter((block) => block.id !== id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <MetadataForm metadata={metadata} onChange={setMetadata} />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Content Blocks</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddBlock('main')}>
                            <Plus className="mr-2 h-4 w-4" />
                            기본
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddBlock('benefit')}>
                            <Plus className="mr-2 h-4 w-4" />
                            혜택
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddBlock('image')}>
                            <Plus className="mr-2 h-4 w-4" />
                            이미지
                        </Button>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <BlockList
                        blocks={blocks}
                        onUpdate={handleUpdateBlock}
                        onRemove={handleRemoveBlock}
                    />
                </DndContext>
            </div>
        </div>
    )
}
