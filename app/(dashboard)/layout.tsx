"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    CircleUserRound, LayoutDashboard,
    ShoppingCart,
    Settings,
    Receipt,
    LogOut,
} from "lucide-react";


export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = useAuthStore((state) => state.user);
    const pathname = usePathname();

    const navItems = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Sales",
            href: "/sales",
            icon: ShoppingCart,
        },
        {
            label: "Reports",
            href: "/reports",
            icon: Receipt,
        },
        {
            label: "Team",
            href: "/team",
            icon: Settings,
        },
        {
            label: "Logout",
            href: "/logout",
            icon: LogOut,
        },
    ];

    return (
        <div className="flex h-screen bg-[var(--color-bg)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-sidebar)] text-white flex flex-col">
                <div className="p-6 text-xl font-semibold border-b border-white/10 h-20">
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-3 py-4 cursor-pointer transition ${isActive
                                        ? "bg-[var(--color-primary)] text-black font-medium"
                                        : "text-white hover:bg-[var(--color-sidebar-hover)]"
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col">
                {/* Top Bar */}
                <header className="flex h-20 flex-shrink-0 items-center justify-between bg-white px-6 shadow-sm">
                    <div className="flex items-center gap-3 ms-10">
                        <div className="font-bold text-[var(--color-sidebar)] text-lg ">
                            AFRICONNECT SOLUTIONS PORTAL
                        </div>
                    </div>

                    <div className="text-sm text-[var(--color-sidebar)] font-semibold flex items-center gap-2 mr-10">
                        <CircleUserRound />
                        {user?.email ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1) : ""}
                    </div>
                </header>

                {/* Content */}
                <main className="flex justify-center p-6 overflow-auto">
                    <div className="w-full mx-30">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}