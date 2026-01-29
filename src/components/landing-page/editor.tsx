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
import { Plus, Download } from "lucide-react"
import { saveAs } from "file-saver"

import { Button } from "@/components/ui/button"
import { Block, BlockType, LandingPageMetadata } from "./types"
import { BlockList } from "./block-list"
import { MetadataForm } from "./metadata-form"
import { generateHtml } from "@/utils/html-generator"

import { Slider } from "@/components/ui/slider"

export function LandingPageEditor() {
    const [metadata, setMetadata] = useState<LandingPageMetadata>({
        title1: "",
        title2: "",
        bgColor: "#1FA4D7",
        imageUrl: "https://cdn.paybooc.co.kr/cbf/bannerimage/PMB0103999/main_image_sample1.png",
        period: ""
    })
    const [blocks, setBlocks] = useState<Block[]>([
        {
            id: 'default-block-1',
            type: 'main',
            content: {
                title: "제목을 입력해주세요",
                content: "본문은 이렇게 보여요. 텍스트를 드래그하면 <b>볼드</b>와 <mark>하이라이트</mark> 설정을 할 수 있어요  <mark><b>동시에 적용</b></mark>도 가능해요"
            }
        }
    ])
    const [previewWidth, setPreviewWidth] = useState(480)

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

    const handleDownload = () => {
        try {
            const html = generateHtml(metadata, blocks)
            const blob = new Blob(['\uFEFF', html], { type: "text/html;charset=utf-8" })
            saveAs(blob, `landing-page-${new Date().getTime()}.html`)
        } catch (error) {
            console.error("Download failed:", error)
            alert("파일 생성 중 오류가 발생했습니다.")
        }
    }

    return (
        <div className="mx-auto max-w-[1600px] p-6">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
                {/* Editor Column */}
                <div className="space-y-8 lg:col-span-3">


                    <MetadataForm metadata={metadata} onChange={setMetadata} />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">내용</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleAddBlock('main')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    기본
                                </Button>
                                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleAddBlock('benefit')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    혜택
                                </Button>
                                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleAddBlock('image')}>
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

                {/* Preview Column */}
                <div className="hidden lg:block relative lg:col-span-2">
                    <div className="sticky top-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">미리보기</h2>
                            <div className="flex items-center gap-4 w-1/2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">너비: {previewWidth}px</span>
                                <Slider
                                    value={[previewWidth]}
                                    min={320}
                                    max={1920}
                                    step={10}
                                    onValueChange={([val]) => setPreviewWidth(val)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl border bg-muted/20 shadow-sm flex justify-center p-8 bg-gray-100 h-[calc(100vh-220px)] min-h-[500px]">
                            <iframe
                                srcDoc={generateHtml(metadata, blocks)}
                                style={{ width: `${previewWidth}px` }}
                                className="h-full bg-white shadow-2xl transition-all duration-300"
                                title="Landing Page Preview"
                            />
                        </div>
                        <Button onClick={handleDownload} className="w-full gap-2" size="lg">
                            <Download className="h-4 w-4" />
                            Download HTML
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
