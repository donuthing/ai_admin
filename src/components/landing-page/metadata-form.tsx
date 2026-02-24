import { useState, useRef, startTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageMetadata } from "./types"
import { Upload, Wand2, Loader2, X, Calendar as CalendarIcon, FileType, Check } from "lucide-react"
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
    const [imageHistory, setImageHistory] = useState<{ url: string; keyword: string }[]>([])

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
                setImageHistory(prev => [{ url: result.imageUrl!, keyword: prompt }, ...prev])
                startTransition(() => {
                    onChange({ ...metadata, imageUrl: result.imageUrl })
                })
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
                <CardContent className="space-y-[22px] p-6">
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


                    <div className="space-y-4">
                        <Label>Image</Label>
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
                                        <Label className="text-sm font-medium">이미지 생성 키워드 (1~2개)</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => setShowPrompt(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="키워드를 입력해 주세요"
                                            className="flex-1"
                                            onKeyDown={(e) => {
                                                if (e.nativeEvent.isComposing) return;
                                                if (e.key === 'Enter' && keyword.trim()) {
                                                    handleGenerateImage()
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={handleGenerateImage}
                                            disabled={isGenerating || !keyword.trim()}
                                            size="sm"
                                            className="shrink-0 px-6"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    생성 중
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="mr-2 h-4 w-4" />
                                                    생성
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Image History Gallery */}
                        {imageHistory.length > 0 && (
                            <div>
                                <div className="flex gap-2 flex-wrap">
                                    {imageHistory.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                startTransition(() => {
                                                    onChange({ ...metadata, imageUrl: item.url })
                                                })
                                            }}
                                            className={`relative group rounded-lg overflow-hidden border-2 transition-all hover:scale-105 shrink-0 grow-0 ${metadata.imageUrl === item.url
                                                ? 'border-primary ring-2 ring-primary/30'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                            style={{ width: 56, height: 56 }}
                                            title={item.keyword}
                                        >
                                            <img
                                                src={item.url}
                                                alt={item.keyword}
                                                className="w-full h-full object-cover"
                                            />
                                            {metadata.imageUrl === item.url && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <Check className="h-5 w-5 text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Label>Button</Label>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={metadata.useButton === true}
                                onClick={() => {
                                    const next = !metadata.useButton;
                                    onChange({ ...metadata, useButton: next, ...(next ? { buttonLandingType: metadata.buttonLandingType || 'url' } : { buttonName: '', buttonUrl: '' }) });
                                }}
                                className={`relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${metadata.useButton ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-md transform transition-transform duration-200 mt-[2px] ${metadata.useButton ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                        }`}
                                />
                            </button>
                        </div>
                        {metadata.useButton && (
                            <div className="space-y-3">
                                <Input
                                    value={metadata.buttonName || ''}
                                    onChange={(e) => onChange({ ...metadata, buttonName: e.target.value })}
                                    placeholder="버튼명을 입력하세요"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={metadata.buttonLandingType || 'url'}
                                        onChange={(e) => onChange({ ...metadata, buttonLandingType: e.target.value as 'screenId' | 'url', buttonUrl: '' })}
                                        className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7 shrink-0"
                                    >
                                        <option value="screenId">화면ID</option>
                                        <option value="url">URL</option>
                                    </select>
                                    <Input
                                        value={metadata.buttonUrl || ''}
                                        onChange={(e) => onChange({ ...metadata, buttonUrl: e.target.value })}
                                        placeholder={metadata.buttonLandingType === 'screenId' ? '화면 ID를 입력하세요' : 'https://example.com'}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
