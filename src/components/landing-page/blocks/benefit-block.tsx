import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BenefitBlockContent, BenefitItemContent } from "../types"

interface BenefitBlockFormProps {
    content: BenefitBlockContent;
    onChange: (content: BenefitBlockContent) => void;
}

export function BenefitBlockForm({ content, onChange }: BenefitBlockFormProps) {
    const handleAddItem = () => {
        onChange({
            ...content,
            items: [...(content.items || []), { subtitle: "", content: "" }]
        })
    }

    const handleItemChange = (index: number, field: keyof BenefitItemContent, value: string) => {
        const newItems = [...(content.items || [])]
        newItems[index] = { ...newItems[index], [field]: value }
        onChange({ ...content, items: newItems })
    }

    const handleRemoveItem = (index: number) => {
        const newItems = content.items.filter((_, i) => i !== index)
        onChange({ ...content, items: newItems })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={content.title}
                    onChange={(e) => onChange({ ...content, title: e.target.value })}
                    placeholder="Main Benefit Title"
                />
            </div>

            <div className="space-y-4">
                <Label>Benefit Items</Label>
                {(content.items || []).map((item, index) => (
                    <div key={index} className="relative rounded-md border p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Subtitle {index + 1}</Label>
                                <Input
                                    value={item.subtitle}
                                    onChange={(e) => handleItemChange(index, "subtitle", e.target.value)}
                                    placeholder="Benefit Subtitle"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Content {index + 1}</Label>
                                <RichTextEditor
                                    value={item.content}
                                    onChange={(value) => handleItemChange(index, "content", value)}
                                    placeholder="Benefit description..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAddItem}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Benefit Item
                </Button>
            </div>
        </div>
    )
}
