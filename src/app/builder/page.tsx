import { AdminLayout } from "@/components/layout/admin-layout"
import { KGonggamEditor } from "@/components/landing-page/editors/k-gonggam"
import { Separator } from "@/components/ui/separator"

export default function BuilderPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">플레이북</h3>

                </div>
                <Separator />
                <KGonggamEditor />
            </div>
        </AdminLayout>
    )
}
