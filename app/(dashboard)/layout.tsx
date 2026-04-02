"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowRight,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  ShoppingCart,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      accent: "Overview",
    },
    {
      label: "Sales",
      href: "/sales",
      icon: ShoppingCart,
      accent: "Transactions",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: Receipt,
      accent: "Insights",
    },
    {
      label: "Team",
      href: "/team",
      icon: Settings,
      accent: "People",
    },
  ];

  const displayName = user?.email
    ? user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1)
    : "User";

  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(180deg,#f4f8ef_0%,#ffffff_35%)]">
      <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#173523_0%,#1d402b_36%,#214932_100%)] text-white lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d8ebb7]">
              Africonnect
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">
              POS Dashboard
            </h1>
            {/* <p className="mt-3 text-sm leading-6 text-white/70">
              Track sales, manage the team, and move through work with a
              cleaner command center.
            </p> */}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    isActive
                      ? "border-[#d2e8a4] bg-[linear-gradient(135deg,#a7c957_0%,#c6df88_100%)] text-[#183824] shadow-[0_18px_40px_rgba(167,201,87,0.2)]"
                      : "border-transparent bg-white/0 text-white/80 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        isActive
                          ? "bg-white/55 text-[#183824]"
                          : "bg-white/8 text-white/90"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p
                        className={`text-xs ${
                          isActive ? "text-[#284f32]/80" : "text-white/55"
                        }`}
                      >
                        {item.accent}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`transition ${
                      isActive
                        ? "translate-x-0 text-[#284f32]"
                        : "text-white/0 group-hover:translate-x-1 group-hover:text-white/60"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 px-4 py-5">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a7c957_0%,#d6e7ab_100%)] text-[var(--color-sidebar)]">
                <span className="text-sm font-bold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{displayName}</p>
                <p className="truncate text-sm text-white/60">
                  {user?.email ?? "Signed in"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-[#e7eedc] bg-white/90 px-6 shadow-sm backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <div className="hidden rounded-2xl bg-[linear-gradient(135deg,#183824_0%,#2f5f42_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(24,56,36,0.15)] sm:block">
              AFRICONNECT SOLUTIONS PORTAL
            </div>
            <div className="sm:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sidebar)]">
                Africonnect
              </p>
              <p className="text-sm text-gray-500">Operations dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#e9efdf] bg-[#f9fbf6] px-3 py-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[var(--color-sidebar)]">
                {displayName}
              </p>
              <p className="text-xs text-gray-500">Active session</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-sidebar)] shadow-sm">
              <CircleUserRound size={22} />
            </div>
          </div>
        </header>

        <div className="border-b border-[#e7eedc] bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-w-fit items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#d8e8b2] bg-[#eff6e4] text-[var(--color-sidebar)]"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
