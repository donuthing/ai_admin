import { AdminLayout } from "@/components/layout/admin-layout"
import { VipWebzineEditor } from "@/components/landing-page/editors/vip-webzine"
import { Separator } from "@/components/ui/separator"

export default function VipWebzinePage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">VIP Webzine</h3>
                </div>
                <Separator />
                <VipWebzineEditor />
            </div>
        </AdminLayout>
    )
}
