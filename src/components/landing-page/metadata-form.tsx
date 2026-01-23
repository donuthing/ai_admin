import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageMetadata } from "./types"

interface MetadataFormProps {
    metadata: LandingPageMetadata;
    onChange: (metadata: LandingPageMetadata) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">기본 정보
            </h2>
            <Card>
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



                    <div className="space-y-2">
                        <Label>Main Image URL</Label>
                        <Input
                            value={metadata.imageUrl || ""}
                            onChange={(e) => onChange({ ...metadata, imageUrl: e.target.value })}
                            placeholder="https://example.com/hero-image.jpg"
                        />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
