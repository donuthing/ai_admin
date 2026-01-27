import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageMetadata } from "./types"
import { Upload, Wand2, Loader2, X } from "lucide-react"
import { generateBaseGeulImage } from "@/app/actions/image"

interface MetadataFormProps {
    metadata: LandingPageMetadata;
    onChange: (metadata: LandingPageMetadata) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const [prompt, setPrompt] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange({ ...metadata, imageUrl: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGenerateImage = async () => {
        if (!prompt.trim()) return

        setIsGenerating(true)
        try {
            const result = await generateBaseGeulImage(prompt)
            if (result.success && result.imageUrl) {
                onChange({ ...metadata, imageUrl: result.imageUrl })
                setShowPrompt(false)
                setPrompt("")
            } else {
                alert(result.error || "이미지 생성에 실패했습니다.")
            }
        } catch (error) {
            console.error("Failed to generate image:", error)
            alert("이미지 생성 중 오류가 발생했습니다.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">기본 정보
            </h2>
            <Card className="border-border/50 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="space-y-4 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Title 1</Label>
                            <Input
                                value={metadata.title1}
                                onChange={(e) => onChange({ ...metadata, title1: e.target.value })}
                                placeholder="Primary Heading"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title 2</Label>
                            <Input
                                value={metadata.title2}
                                onChange={(e) => onChange({ ...metadata, title2: e.target.value })}
                                placeholder="Secondary Heading"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Period</Label>
                        <Input
                            value={metadata.period || ""}
                            onChange={(e) => onChange({ ...metadata, period: e.target.value })}
                            placeholder="e.g. 2024.03.01 - 2024.03.31"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Background Color (Hex)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={metadata.bgColor}
                                onChange={(e) => onChange({ ...metadata, bgColor: e.target.value })}
                                placeholder="#ffffff"
                                className="font-mono"
                            />
                            <div
                                className="h-10 w-10 rounded border shadow-sm"
                                style={{ backgroundColor: metadata.bgColor }}
                            />
                        </div>
                    </div>



                    <div className="space-y-4">
                        <Label>Main Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={metadata.imageUrl || ""}
                                onChange={(e) => onChange({ ...metadata, imageUrl: e.target.value })}
                                placeholder="https://example.com/hero-image.jpg"
                                className="flex-1"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="이미지 업로드"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowPrompt(!showPrompt)}
                                    title="Gemini로 이미지 생성"
                                    className={showPrompt ? "bg-secondary" : ""}
                                >
                                    <Wand2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {showPrompt && (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-medium">Gemini 이미지 생성 프롬프트</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => setShowPrompt(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="생성하고 싶은 이미지에 대해 자세히 설명해주세요 (예: 미래지향적인 도시 풍경, 파란색 톤의 비즈니스 미팅 등)"
                                        rows={3}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerateImage}
                                            disabled={isGenerating || !prompt.trim()}
                                            size="sm"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    생성 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="mr-2 h-4 w-4" />
                                                    이미지 생성
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
