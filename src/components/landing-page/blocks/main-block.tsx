import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Label } from "@/components/ui/label"
import { MainBlockContent } from "../types"

interface MainBlockFormProps {
    content: MainBlockContent;
    onChange: (content: MainBlockContent) => void;
}

export function MainBlockForm({ content, onChange }: MainBlockFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={content.title}
                    onChange={(e) => onChange({ ...content, title: e.target.value })}
                    placeholder="Main Title"
                />
            </div>
            <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                    value={content.content}
                    onChange={(value) => onChange({ ...content, content: value })}
                    placeholder="Detailed description..."
                />
            </div>
        </div>
    )
}
