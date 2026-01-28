"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
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
                <AnimatePresence initial={false}>
                    {blocks.map((block) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden p-1"
                        >
                            <BlockItem
                                block={block}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div >
        </SortableContext >
    )
}
