"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { Block, MainBlockContent, BenefitBlockContent, ImageBlockContent } from "./types"
import { MainBlockForm } from "./blocks/main-block"
import { BenefitBlockForm } from "./blocks/benefit-block"
import { ImageBlockForm } from "./blocks/image-block"

interface BlockItemProps {
    block: Block
    onUpdate: (id: string, content: any) => void
    onRemove: (id: string) => void
}

export function BlockItem({ block, onUpdate, onRemove }: BlockItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative" as const,
    }

    const handleContentChange = (content: any) => {
        onUpdate(block.id, content)
    }

    return (
        <div ref={setNodeRef} style={style} className={cn("group mb-4", isDragging && "opacity-50")}>
            <Card className="border-border/50 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-center space-y-0 p-4">
                    <div
                        {...attributes}
                        {...listeners}
                        className="mr-2 cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            {block.type === 'image'
                                ? (block.content as any).caption || ""
                                : (block.content as any).title || ""}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(block.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                    {block.type === "main" && (
                        <MainBlockForm
                            content={block.content as MainBlockContent}
                            onChange={handleContentChange}
                        />
                    )}
                    {block.type === "benefit" && (
                        <BenefitBlockForm
                            content={block.content as BenefitBlockContent}
                            onChange={handleContentChange}
                        />
                    )}
                    {block.type === "image" && (
                        <ImageBlockForm
                            content={block.content as ImageBlockContent}
                            onChange={handleContentChange}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
