"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = useAuthStore((state) => state.user);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-[var(--color-bg)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-sidebar)] text-white flex flex-col">
                <div className="p-6 text-xl font-semibold border-b border-white/10">
                    AFRICONNECT
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div
                        className={`rounded px-3 py-2 cursor-pointer ${pathname === "/dashboard"
                                ? "bg-[var(--color-primary)] text-black font-medium"
                                : "hover:bg-[var(--color-sidebar-hover)]"
                            }`}
                    >
                        Dashboard
                    </div>
                    <div className="rounded px-3 py-2 hover:bg-[var(--color-sidebar-hover)] cursor-pointer">
                        Transactions
                    </div>
                    <div className="rounded px-3 py-2 hover:bg-[var(--color-sidebar-hover)] cursor-pointer">
                        Settings
                    </div>
                </nav>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col">
                {/* Top Bar */}
                <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
                    <div className="font-medium text-[var(--color-text-dark)]">
                        Dashboard
                    </div>

                    <div className="text-sm text-[var(--color-text-muted)]">
                        {user?.name}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}