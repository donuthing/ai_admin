"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background/60 backdrop-blur-xl">
            <div className="flex h-14 items-center px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="h-6 w-6 rounded-full bg-primary" />
                    <span>Admin</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                        href="/builder"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            pathname === "/builder"
                                ? "bg-muted text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <FileText className="h-4 w-4" />
                        K공감
                    </Link>
                    <Link
                        href="/vip-webzine"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            pathname === "/vip-webzine"
                                ? "bg-muted text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <FileText className="h-4 w-4" />
                        VIP 웹진
                    </Link>
                </nav>
            </div>
        </div>
    )
}
