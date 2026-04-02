"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { ArrowRight, Download, Search } from "lucide-react";
import { getSalesByDate } from "@/services/sales.service";
import { SalesTable } from "@/components/tables/sales-table";
import { exportSalesToExcel } from "@/services/export.service";

interface Sale {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  total_amount: string;
  payment_method: string;
  created_at: string;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [search, setSearch] = useState("");

  const toLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");

        const date = selectedDate ? toLocalDateString(selectedDate) : "";

        const data = await getSalesByDate(date);
        setSales(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [selectedDate]);

  const formattedDate = selectedDate
    ? toLocalDateString(selectedDate)
    : "All dates";

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#dce8cf] bg-[linear-gradient(135deg,#183f2b_0%,#275338_58%,#a7cb57_140%)] px-7 py-8 text-white shadow-[0_28px_90px_rgba(24,63,43,0.16)] md:px-9 md:py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Sales Overview
            </span>
            <div className="">
              {/* <h1 className="text-4xl font-bold tracking-tight">
                See today&apos;s transactions with more clarity
              </h1> */}
              {/* <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                See today&apos;s transactions with more clarity
              </p> */}
            </div>
          </div>

        </div>
      </section>

      <section className="rounded-[30px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Transactions
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Sales activity for {formattedDate}
            </h2>
            <p className="text-sm text-gray-500">
              Filter by date, search quickly, or export the visible day&apos;s
              records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8e4c6] bg-[#f7fbf1] px-5 text-sm font-semibold text-[var(--color-sidebar)] transition hover:bg-[#f0f7e5]"
              onClick={() => exportSalesToExcel(sales)}
            >
              <Download size={16} />
              Export sales
            </button>

            <Link
              href="/sales/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sidebar)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Create new sale
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <input
              type="date"
              value={selectedDate ? toLocalDateString(selectedDate) : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                if (val) {
                  const [y, m, d] = val.split("-").map(Number);
                  setSelectedDate(new Date(y, m - 1, d));
                } else {
                  setSelectedDate(null);
                }
                e.target.blur();
              }}
              className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm text-gray-700 focus:border-(--color-primary) focus:outline-none focus:ring-4 focus:ring-[#a7cb57]/20"
            />
          </div>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by sale ID, name, payment method, or date..."
              className="h-12 w-full rounded-2xl border border-gray-200 text-sm text-gray-700 focus:ring-0"
              style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
            />
          </div>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-12 text-center text-sm text-gray-500">
              Loading sales data...
            </div>
          )}

          {error && (
            <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && sales.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[#dbe7cb] bg-[#fbfdf8] px-5 py-12 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No transactions found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try another date or create a new sale to get started.
              </p>
            </div>
          )}

          {!loading && !error && sales.length > 0 && (
            <SalesTable data={sales} search={search} />
          )}
        </div>
      </section>
    </div>
  );
}
