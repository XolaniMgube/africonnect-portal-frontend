"use client";

import { useEffect, useState } from "react";
import { getSalesByDate } from "@/services/sales.service";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Sale {
  id: number;
  total_amount: string;
  payment_method: string;
  created_at: string;
}

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const data = await getSalesByDate(today);
      setSales(data);
    };

    fetchData();
  }, []);

  // 🔥 Calculations
  const total = sales.reduce(
    (sum, s) => sum + Number(s.total_amount),
    0
  );

  const cashTotal = sales
    .filter((s) => s.payment_method === "Cash")
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  const cardTotal = sales
    .filter((s) => s.payment_method === "Card")
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  // 🔥 Chart data (group by hour)
  const chartData = sales.map((s) => ({
    time: new Date(s.created_at).getHours() + ":00",
    amount: Number(s.total_amount),
  }));

  return (
    <div className="container mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Business overview for today
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">R{total.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Cash</p>
          <p className="text-2xl font-bold">R{cashTotal.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Card</p>
          <p className="text-2xl font-bold">R{cardTotal.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="text-2xl font-bold">{sales.length}</p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Sales Trend (Today)
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#A7C957"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT SALES */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Recent Sales
          </h2>

          <Link href="/sales" className="text-sm text-blue-600">
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {sales.slice(0, 5).map((sale) => (
            <div
              key={sale.id}
              className="flex justify-between border p-3 rounded"
            >
              <div>
                <p className="font-medium">Sale #{sale.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(sale.created_at).toLocaleString()}
                </p>
              </div>

              <div className="font-semibold">
                R{Number(sale.total_amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* QUICK ACTIONS */}
      <div className="flex gap-4">
        <Link
          href="/sales/new"
          className="bg-[var(--color-primary)] px-6 py-3 rounded font-medium"
        >
          + New Sale
        </Link>

        <Link
          href="/sales"
          className="bg-gray-800 text-white px-6 py-3 rounded"
        >
          View Sales
        </Link>
      </div>

    </div>
  );
}