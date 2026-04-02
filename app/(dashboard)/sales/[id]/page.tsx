"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, Receipt, User } from "lucide-react";
import { getSaleById } from "@/services/sales.service";

interface SaleItem {
  id: number;
  sale_id: number;
  service_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  service_name: string;
}

interface Sale {
  id: number;
  employee_id: number;
  employee_name: string;
  total_amount: string;
  payment_method: string;
  created_at: string;
  items: SaleItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

export default function SaleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getSaleById(Number(id));
        setSale(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load sale.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading sale...
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error || "Sale not found."}
      </div>
    );
  }

  const date = new Date(sale.created_at);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to sales
      </button>

      {/* Header */}
      <div className="rounded-[28px] border border-[#dce8cf] bg-[linear-gradient(135deg,#183f2b_0%,#275338_58%,#a7cb57_140%)] px-7 py-8 text-white shadow-[0_28px_90px_rgba(24,63,43,0.16)] md:px-9 md:py-10">
        <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
          Sale #{sale.id}
        </span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-4xl font-bold">{formatCurrency(Number(sale.total_amount))}</p>
            <p className="mt-1 text-sm text-white/70">Total sale amount</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <CreditCard size={15} className="text-white/70" />
              <span className="text-sm font-semibold">{sale.payment_method}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <User size={15} className="text-white/70" />
              <span className="text-sm font-semibold">{sale.employee_name || `Employee #${sale.employee_id}`}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <Calendar size={15} className="text-white/70" />
              <span className="text-sm font-semibold">{date.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-[28px] border border-[#e4ebdb] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1f7e8] text-[#36502a]">
            <Receipt size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Line items</h2>
            <p className="text-sm text-gray-500">{sale.items.length} service{sale.items.length !== 1 ? "s" : ""} in this sale</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#e8edde]">
          <table className="w-full text-sm">
            <thead className="bg-[#fbfcf8]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Service</th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Qty</th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Unit price</th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2e8]">
              {sale.items.map((item) => (
                <tr key={item.id} className="transition hover:bg-[#fbfdf8]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{item.service_name}</p>
                    <p className="text-xs text-gray-400">Service #{item.service_id}</p>
                  </td>
                  <td className="px-5 py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="px-5 py-4 text-right text-gray-700">{formatCurrency(Number(item.price))}</td>
                  <td className="px-5 py-4 text-right font-semibold text-gray-900">{formatCurrency(Number(item.subtotal))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#e4ebdb] bg-[#f7fbf1]">
                <td colSpan={3} className="px-5 py-4 text-right text-sm font-semibold text-gray-700">Total</td>
                <td className="px-5 py-4 text-right text-lg font-bold text-gray-900">
                  {formatCurrency(Number(sale.total_amount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
