import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageBlockContent } from "../types"

interface ImageBlockFormProps {
    content: ImageBlockContent;
    onChange: (content: ImageBlockContent) => void;
}

export function ImageBlockForm({ content, onChange }: ImageBlockFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                    value={content.imageUrl}
                    onChange={(e) => onChange({ ...content, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
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
