import { useState, useRef, startTransition } from "react"
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
    const [keyword, setKeyword] = useState("")

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
        const prompt = keyword.trim()
        console.log("Generating image with keyword:", prompt);
        if (!prompt) return

        setIsGenerating(true)
        try {
            const result = await generateBaseGeulImage(prompt, true)
            if (result.success && result.imageUrl) {
                startTransition(() => {
                    onChange({ ...metadata, imageUrl: result.imageUrl })
                })
                setShowPrompt(false)
                setKeyword("")
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
                        <Label>Key Color</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={metadata.bgColor}
                                onChange={(e) => onChange({ ...metadata, bgColor: e.target.value })}
                                placeholder="#ffffff"
                                className="font-mono flex-1"
                            />
                            <label
                                className="h-10 w-10 rounded border shadow-sm cursor-pointer block shrink-0 overflow-hidden"
                                style={{ backgroundColor: metadata.bgColor }}
                                title="컬러 픽커"
                            >
                                <input
                                    type="color"
                                    value={metadata.bgColor || '#29abe2'}
                                    onChange={(e) => onChange({ ...metadata, bgColor: e.target.value })}
                                    className="opacity-0 w-full h-full cursor-pointer"
                                />
                            </label>
                            <Button
                                variant="outline"
                                size="icon"
                                title="스포이드"
                                className="shrink-0"
                                onClick={async () => {
                                    try {
                                        // @ts-ignore - EyeDropper API
                                        const eyeDropper = new EyeDropper();
                                        const result = await eyeDropper.open();
                                        onChange({ ...metadata, bgColor: result.sRGBHex });
                                    } catch (e) {
                                        console.log("EyeDropper cancelled or not supported");
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m2 22 1-1h3l9-9" />
                                    <path d="M3 21v-3l9-9" />
                                    <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
                                </svg>
                            </Button>
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
                                        <Input
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="이미지 생성을 위한 키워드를 입력하세요"
                                            className="flex-1"
                                            onKeyDown={(e) => {
                                                if (e.nativeEvent.isComposing) return;
                                                if (e.key === 'Enter' && keyword.trim()) {
                                                    handleGenerateImage()
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleGenerateImage}
                                            disabled={isGenerating || !keyword.trim()}
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
