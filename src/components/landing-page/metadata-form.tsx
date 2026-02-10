import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageMetadata } from "./types"
import { Upload, Wand2, Loader2, X, Calendar as CalendarIcon, FileType } from "lucide-react"
import { generateBaseGeulImage } from "@/app/actions/image"
import { Toggle } from "@/components/ui/toggle"

interface MetadataFormProps {
    metadata: LandingPageMetadata;
    onChange: (metadata: LandingPageMetadata) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isGenerating, setIsGenerating] = useState(false)
    const [showPrompt, setShowPrompt] = useState(false)
    const [keywords, setKeywords] = useState(["", "", ""])

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
        const prompt = keywords.filter(k => k.trim()).join(", ")
        console.log("Generating image with keywords:", prompt);
        if (!prompt) return

        setIsGenerating(true)
        try {
            const result = await generateBaseGeulImage(prompt, true)
            if (result.success && result.imageUrl) {
                onChange({ ...metadata, imageUrl: result.imageUrl })
                setShowPrompt(false)
                setKeywords(["", "", ""])
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
            <Card className="border-border/50 shadow transition-all hover:border-primary/50 hover:shadow-md">
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
                            {metadata.imageUrl?.startsWith("data:") ? (
                                <div className="relative flex-1">
                                    <Input
                                        value="이미지 생성 완료"
                                        readOnly
                                        className="flex-1 pr-10 text-muted-foreground"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                        onClick={() => onChange({ ...metadata, imageUrl: "" })}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Input
                                    value={metadata.imageUrl || ""}
                                    onChange={(e) => onChange({ ...metadata, imageUrl: e.target.value })}
                                    placeholder="https://example.com/hero-jpg"
                                    className="flex-1"
                                />
                            )}
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
                                        <Label className="text-sm font-medium">Gemini 이미지 생성 키워드 입력 (1~2개 권장)</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => setShowPrompt(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((index) => (
                                            <Input
                                                key={index}
                                                value={keywords[index]}
                                                onChange={(e) => {
                                                    const newKeywords = [...keywords]
                                                    newKeywords[index] = e.target.value
                                                    setKeywords(newKeywords)
                                                }}
                                                placeholder={`키워드 ${index + 1}`}
                                                className="flex-1"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && keywords.some(k => k.trim())) {
                                                        handleGenerateImage()
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerateImage}
                                            disabled={isGenerating || !keywords.some(k => k.trim())}
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
