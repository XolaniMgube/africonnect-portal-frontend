"use client";

import { useEffect, useMemo, useState } from "react";
import { getSalesByDateRange } from "@/services/sales.service";
import { exportSalesToExcel } from "@/services/export.service";
import { SalesTable } from "@/components/tables/sales-table";
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
  BarChart2,
  Calendar,
  CreditCard,
  Download,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface Sale {
  id: number;
  name: string;
  employee_id: number;
  total_amount: string;
  payment_method: string;
  created_at: string;
}

type Period = "week" | "month" | "custom";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

const toDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const today = () => toDateString(new Date());

function getPresetRange(period: "week" | "month"): { startDate: string; endDate: string } {
  const now = new Date();
  if (period === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return { startDate: toDateString(new Date(now.setDate(diff))), endDate: today() };
  } else {
    return {
      startDate: toDateString(new Date(now.getFullYear(), now.getMonth(), 1)),
      endDate: today(),
    };
  }
}

function formatRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Active range used for fetching
  const [activeRange, setActiveRange] = useState(() => getPresetRange("week"));

  // Custom picker state (not yet submitted)
  const [customStart, setCustomStart] = useState(today());
  const [customEnd, setCustomEnd] = useState(today());
  const [customError, setCustomError] = useState("");

  // When switching to a preset period, fetch immediately
  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    if (p !== "custom") {
      setActiveRange(getPresetRange(p));
    }
  };

  const handleGenerateCustom = () => {
    if (!customStart || !customEnd) {
      setCustomError("Please select both a start and end date.");
      return;
    }
    if (customStart > customEnd) {
      setCustomError("Start date must be before or equal to end date.");
      return;
    }
    setCustomError("");
    setActiveRange({ startDate: customStart, endDate: customEnd });
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSalesByDateRange(activeRange.startDate, activeRange.endDate);
        setSales(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [activeRange]);

  const metrics = useMemo(() => {
    const total = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const cashTotal = sales
      .filter((s) => s.payment_method.toLowerCase() === "cash")
      .reduce((sum, s) => sum + Number(s.total_amount), 0);
    const cardTotal = sales
      .filter((s) => s.payment_method.toLowerCase() === "card")
      .reduce((sum, s) => sum + Number(s.total_amount), 0);
    const average = sales.length > 0 ? total / sales.length : 0;
    return { total, cashTotal, cardTotal, average, count: sales.length };
  }, [sales]);

  const chartData = useMemo(() => {
    const dayMap = new Map<string, number>();
    sales.forEach((s) => {
      const day = new Date(s.created_at).toLocaleDateString("en-ZA", {
        month: "short",
        day: "numeric",
      });
      dayMap.set(day, (dayMap.get(day) ?? 0) + Number(s.total_amount));
    });
    return Array.from(dayMap.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, amount]) => ({ date, amount }));
  }, [sales]);

  const rangeLabel = formatRange(activeRange.startDate, activeRange.endDate);

  const periodLabel =
    period === "week" ? "this week" : period === "month" ? "this month" : "custom range";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-[30px] border border-[#dce8cf] bg-[linear-gradient(135deg,#183f2b_0%,#275338_55%,#a7cb57_145%)] px-7 py-8 text-white shadow-[0_28px_90px_rgba(24,63,43,0.16)] md:px-9 md:py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Reports
            </span>
            {/* <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Understand performance over time
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                Select a preset period or pick a custom date range to review revenue,
                payment trends, and transaction history.
              </p>
            </div> */}
          </div>

          {/* <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[500px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Period revenue</p>
              <p className="mt-2 text-2xl font-semibold">
                {loading ? "—" : formatCurrency(metrics.total)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Transactions</p>
              <p className="mt-2 text-2xl font-semibold">
                {loading ? "—" : metrics.count}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Average sale</p>
              <p className="mt-2 text-2xl font-semibold">
                {loading ? "—" : formatCurrency(metrics.average)}
              </p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Period selector + custom date range */}
      <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-6">
          {/* Preset + custom toggle row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["week", "month", "custom"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${
                    period === p
                      ? "bg-[var(--color-sidebar)] text-white"
                      : "border border-[#dce8cf] bg-white text-[var(--color-sidebar)] hover:bg-[#f4f9ee]"
                  }`}
                >
                  {p === "custom" ? <Calendar size={16} /> : <BarChart2 size={16} />}
                  {p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom Range"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{rangeLabel}</span>
              <button
                onClick={() => exportSalesToExcel(sales)}
                disabled={loading || sales.length === 0}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#d8e4c6] bg-[#f7fbf1] px-5 text-sm font-semibold text-[var(--color-sidebar)] transition hover:bg-[#f0f7e5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Custom date picker — only visible when custom is selected */}
          {period === "custom" && (
            <div className="rounded-[24px] border border-[#dce8cf] bg-[#f9fbf6] p-5">
              <p className="mb-4 text-sm font-semibold text-[var(--color-sidebar)]">
                Select date range
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    max={customEnd || today()}
                    onChange={(e) => {
                      setCustomStart(e.target.value);
                      setCustomError("");
                    }}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[#a7cb57]/20"
                  />
                </div>

                <div className="flex h-12 w-8 shrink-0 items-center justify-center text-gray-400 sm:mb-0">
                  <ArrowRight size={16} />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    End date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    max={today()}
                    onChange={(e) => {
                      setCustomEnd(e.target.value);
                      setCustomError("");
                    }}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[#a7cb57]/20"
                  />
                </div>

                <button
                  onClick={handleGenerateCustom}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[var(--color-sidebar)] px-6 text-sm font-semibold text-white transition hover:brightness-110 sm:shrink-0"
                >
                  Generate report
                  <ArrowRight size={16} />
                </button>
              </div>

              {customError && (
                <p className="mt-3 text-sm text-red-500">{customError}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Metric cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-[#e6ecdc] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6e4] text-[#35512a]">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : formatCurrency(metrics.total)}
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
                {loading ? "—" : formatCurrency(metrics.cardTotal)}
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
                {loading ? "—" : formatCurrency(metrics.cashTotal)}
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
              <p className="text-sm text-gray-500">Average sale</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : formatCurrency(metrics.average)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue trend chart */}
      <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Revenue trend
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Daily sales for {periodLabel}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{rangeLabel}</p>
        </div>

        {loading && (
          <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-16 text-center text-sm text-gray-500">
            Loading chart data...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-16 text-center">
            <p className="text-lg font-semibold text-gray-900">No data for this period</p>
            <p className="mt-2 text-sm text-gray-500">
              Sales recorded in this period will appear here.
            </p>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7c957" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a7c957" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2e8" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R${v}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: "16px", borderColor: "#e4ebdb" }}
                />
                <Area type="monotone" dataKey="amount" stroke="none" fill="url(#reportFill)" />
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
      </section>

      {/* Transactions table */}
      {/* <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Transactions
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              All sales for {periodLabel}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{rangeLabel}</p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="h-11 w-full rounded-2xl border border-gray-200 px-4 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[#a7cb57]/20 sm:w-72"
          />
        </div>

        {loading && (
          <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-12 text-center text-sm text-gray-500">
            Loading transactions...
          </div>
        )}

        {error && (
          <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && sales.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-12 text-center">
            <p className="text-lg font-semibold text-gray-900">No transactions found</p>
            <p className="mt-2 text-sm text-gray-500">
              No sales were recorded in this period.
            </p>
          </div>
        )}

        {!loading && !error && sales.length > 0 && (
          <SalesTable data={sales} search={search} />
        )}
      </section> */}
    </div>
  );
}
