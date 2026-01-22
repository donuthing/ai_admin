import { AdminLayout } from "@/components/layout/admin-layout"
import { LandingPageEditor } from "@/components/landing-page/editor"
import { Separator } from "@/components/ui/separator"

export default function BuilderPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Landing Page Builder</h3>
                    <p className="text-sm text-muted-foreground">
                        Construct your landing page by adding and reordering blocks.
                    </p>
                </div>
                <Separator />
                <LandingPageEditor />
            </div>
        </AdminLayout>
    )
}
