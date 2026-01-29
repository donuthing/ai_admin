"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
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
import { Plus, Download, X } from "lucide-react"
import { saveAs } from "file-saver"

import { Button } from "@/components/ui/button"
import { Block, BlockType, LandingPageMetadata } from "./types"
import { BlockList } from "./block-list"
import { MetadataForm } from "./metadata-form"
import { generateHtml, getPreviewStyles } from "@/utils/html-generator"
import { PreviewRenderer } from "./preview-renderer"

import { Slider } from "@/components/ui/slider"

interface BaseEditorProps {
    initialMetadata?: LandingPageMetadata
    initialBlocks?: Block[]
    availableBlocks?: BlockType[]
    defaultBlockContent?: Partial<Record<BlockType, any>>
}

const DEFAULT_METADATA: LandingPageMetadata = {
    title1: "제목을 입력하면",
    title2: "이렇게 보여요",
    bgColor: "#A093FF",
    imageUrl: "",
    period: ""
}

const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
}

export function BaseEditor({
    initialMetadata = DEFAULT_METADATA,
    initialBlocks = [],
    availableBlocks = ['main', 'benefit', 'image'],
    defaultBlockContent = {}
}: BaseEditorProps) {
    const [metadata, setMetadata] = useState<LandingPageMetadata>(() => {
        if (initialMetadata === DEFAULT_METADATA) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return {
                ...DEFAULT_METADATA,
                period: `${formatDate(today)} - ${formatDate(tomorrow)}`
            }
        }
        return initialMetadata
    })
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
    const [previewWidth, setPreviewWidth] = useState(390)
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const prevBlocksLengthRef = useRef(blocks.length)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const initIframe = () => {
            const doc = iframe.contentDocument
            if (doc) {
                doc.open()
                doc.write(`
                    <!DOCTYPE html>
                    <html lang="ko">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
                        </head>
                        <body><div id="root"></div></body>
                    </html>
                `)
                doc.close()
                setIframeBody(doc.body as HTMLElement)
            }
        }

        if (iframe.contentDocument?.readyState === 'complete') {
            initIframe()
        } else {
            iframe.addEventListener('load', initIframe)
        }

        return () => iframe.removeEventListener('load', initIframe)
    }, [])

    useEffect(() => {
        if (blocks.length > prevBlocksLengthRef.current) {
            // Slight delay to allow DOM to update
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            }, 100)
        }
        prevBlocksLengthRef.current = blocks.length
    }, [blocks.length])

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
            content: defaultBlockContent[type] || (type === 'main'
                ? { title: "", content: "" }
                : type === 'benefit'
                    ? { title: "", items: [{ subtitle: "", content: "" }] }
                    : { imageUrl: "", caption: "" }),
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
                        {blocks.length > 0 && (
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">내용</h2>
                            </div>
                        )}

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

                    {/* Floating Action Button */}
                    {/* Scroll Anchor */}
                    <div ref={bottomRef} />

                    {/* Floating Action Button */}
                    <div className="sticky bottom-20 h-0 flex justify-end overflow-visible z-50 pointer-events-none">
                        <div className="relative pointer-events-auto">
                            {isAddMenuOpen && (
                                <div className="absolute bottom-full right-0 flex flex-col gap-2 min-w-[120px] bg-white rounded-lg shadow-xl border p-2 animate-in fade-in slide-in-from-bottom-5 mb-2">
                                    {availableBlocks.includes('main') && (
                                        <Button variant="ghost" className="justify-start" onClick={() => { handleAddBlock('main'); setIsAddMenuOpen(false); }}>
                                            기본
                                        </Button>
                                    )}
                                    {availableBlocks.includes('benefit') && (
                                        <Button variant="ghost" className="justify-start" onClick={() => { handleAddBlock('benefit'); setIsAddMenuOpen(false); }}>
                                            혜택
                                        </Button>
                                    )}
                                    {availableBlocks.includes('image') && (
                                        <Button variant="ghost" className="justify-start" onClick={() => { handleAddBlock('image'); setIsAddMenuOpen(false); }}>
                                            이미지
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Button
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-xl transition-all active:scale-95 text-white hover:brightness-90"
                                style={{ backgroundColor: 'lab(61 0 -0.01)' }}
                                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            >
                                {isAddMenuOpen ? <X className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                            </Button>
                        </div>
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
                                    max={600}
                                    step={10}
                                    onValueChange={([val]) => setPreviewWidth(val)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border bg-muted/20 shadow-sm flex justify-center p-8 bg-gray-100 h-[calc(100vh-250px)]">
                            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center', height: '125%', display: 'flex', justifyContent: 'center' }}>
                                <iframe
                                    ref={iframeRef}
                                    style={{ width: `${previewWidth}px` }}
                                    className="h-full bg-white shadow-2xl transition-all duration-300"
                                    title="Landing Page Preview"
                                />
                                {iframeBody && createPortal(
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: getPreviewStyles(metadata) }} />
                                        <PreviewRenderer metadata={metadata} blocks={blocks} />
                                    </>,
                                    iframeBody
                                )}
                            </div>
                        </div>
                        <Button onClick={handleDownload} className="w-full gap-2" size="lg">
                            <Download className="h-4 w-4" />
                            HTML 다운로드
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
