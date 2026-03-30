"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSalesByDate } from "@/services/sales.service";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  CreditCard,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface Sale {
  id: number;
  total_amount: string;
  payment_method: string;
  created_at: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const today = new Date().toISOString().split("T")[0];
        const data = await getSalesByDate(today);
        setSales(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const total = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const cashTotal = sales
      .filter((sale) => sale.payment_method.toLowerCase() === "cash")
      .reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const cardTotal = sales
      .filter((sale) => sale.payment_method.toLowerCase() === "card")
      .reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const average = sales.length > 0 ? total / sales.length : 0;

    return {
      total,
      cashTotal,
      cardTotal,
      average,
      count: sales.length,
    };
  }, [sales]);

  const chartData = useMemo(() => {
    const hourMap = new Map<string, number>();

    sales.forEach((sale) => {
      const hour = `${new Date(sale.created_at)
        .getHours()
        .toString()
        .padStart(2, "0")}:00`;
      hourMap.set(hour, (hourMap.get(hour) ?? 0) + Number(sale.total_amount));
    });

    return Array.from(hourMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, amount]) => ({
        time,
        amount,
      }));
  }, [sales]);

  const recentSales = useMemo(
    () =>
      [...sales]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5),
    [sales]
  );

  const bestChannel =
    metrics.cashTotal === 0 && metrics.cardTotal === 0
      ? "No sales yet"
      : metrics.cashTotal >= metrics.cardTotal
        ? "Cash is leading"
        : "Card is leading";

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#dce8cf] bg-[linear-gradient(135deg,#183f2b_0%,#275338_55%,#a7cb57_145%)] px-7 py-8 text-white shadow-[0_28px_90px_rgba(24,63,43,0.16)] md:px-9 md:py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Dashboard
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                See how the business is performing today
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                Track today&apos;s revenue, compare payment channels, and move
                quickly from insights into action.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[500px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Today&apos;s revenue</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(metrics.total)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Transactions</p>
              <p className="mt-2 text-2xl font-semibold">{metrics.count}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Average sale</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(metrics.average)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-[#e6ecdc] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6e4] text-[#35512a]">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e6ecdc] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f5ff] text-[#3c5ba9]">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Card payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.cardTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e6ecdc] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5e9] text-[#b46b10]">
              <ReceiptText size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cash payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.cashTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e6ecdc] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f8f4] text-[#25553a]">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Best channel</p>
              <p className="text-lg font-bold text-gray-900">{bestChannel}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Revenue trend
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Sales flow through the day
              </h2>
            </div>
          </div>

          {loading && (
            <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-16 text-center text-sm text-gray-500">
              Loading dashboard data...
            </div>
          )}

          {error && (
            <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && chartData.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-16 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No sales trend to display yet
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Once sales are recorded today, the hourly revenue trend will
                appear here.
              </p>
            </div>
          )}

          {!loading && !error && chartData.length > 0 && (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a7c957" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a7c957" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef2e8" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "16px",
                      borderColor: "#e4ebdb",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="none"
                    fill="url(#salesFill)"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#7ba63a"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#7ba63a" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6e4] text-[#35512a]">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  Quick actions
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  Keep things moving
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/sales/new"
                className="flex items-center justify-between rounded-2xl bg-[var(--color-sidebar)] px-5 py-4 text-white transition hover:brightness-110"
              >
                <div>
                  <p className="font-semibold">Create new sale</p>
                  <p className="text-sm text-white/70">
                    Capture a transaction quickly
                  </p>
                </div>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/sales"
                className="flex items-center justify-between rounded-2xl border border-[#dbe7cb] bg-[#f7fbf1] px-5 py-4 text-[var(--color-sidebar)] transition hover:bg-[#eff6e4]"
              >
                <div>
                  <p className="font-semibold">View all sales</p>
                  <p className="text-sm text-gray-500">
                    Explore the full transaction list
                  </p>
                </div>
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  Recent activity
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  Latest transactions
                </h2>
              </div>
              <Link
                href="/sales"
                className="text-sm font-semibold text-[var(--color-sidebar)]"
              >
                View all
              </Link>
            </div>

            {loading && (
              <p className="text-sm text-gray-500">Loading recent sales...</p>
            )}

            {!loading && !error && recentSales.length === 0 && (
              <p className="text-sm text-gray-500">
                No recent transactions recorded yet today.
              </p>
            )}

            {!loading && !error && recentSales.length > 0 && (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-2xl border border-[#edf2e7] bg-[#fbfcf8] px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Sale #{sale.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.created_at).toLocaleString()} •{" "}
                        {sale.payment_method}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(Number(sale.total_amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
