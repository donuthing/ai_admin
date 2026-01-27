import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageBlockContent } from "../types"

interface ImageBlockFormProps {
    content: ImageBlockContent;
    onChange: (content: ImageBlockContent) => void;
}

export function ImageBlockForm({ content, onChange }: ImageBlockFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange({ ...content, imageUrl: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                    <Input
                        value={content.imageUrl}
                        onChange={(e) => onChange({ ...content, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                    />
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
                        title="Upload Image"
                    >
                        <Upload className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Caption</Label>
                <Input
                    value={content.caption}
                    onChange={(e) => onChange({ ...content, caption: e.target.value })}
                    placeholder="Image caption..."
                />
            </div>
        </div>
    )
}
