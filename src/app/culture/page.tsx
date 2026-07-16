import { AdminLayout } from "@/components/layout/admin-layout"
import { CultureEditor } from "@/components/landing-page/editors/culture"
import { Separator } from "@/components/ui/separator"

export default function CulturePage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">문화</h3>

                </div>
                <Separator />
                <CultureEditor />
            </div>
        </AdminLayout>
    )
}
