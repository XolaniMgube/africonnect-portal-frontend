"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, Plus, Trash2 } from "lucide-react";
import { getServices } from "@/services/services.service";
import { createSale } from "@/services/sales.service";
import { getEmployees } from "@/services/auth.service";

interface Service {
  id: number;
  name: string;
  price: string;
  is_custom: boolean;
}

interface Item {
  service: Service;
  quantity: number;
  unitPrice: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

export default function CreateNewSalePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [employeeName, setEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
    fetchEmployees();
  }, []);

  const selectedService = services.find(
    (service) => service.id === Number(selectedServiceId)
  );

  useEffect(() => {
    if (!selectedService) {
      setUnitPrice("");
      return;
    }

    setUnitPrice(selectedService.price);
  }, [selectedService]);

  const parsedUnitPrice = Number(unitPrice) || 0;
  const previewTotal = parsedUnitPrice * quantity;

  const addItem = () => {
    if (!selectedService || quantity < 1) return;

    setItems((prev) => [
      ...prev,
      {
        service: selectedService,
        quantity,
        unitPrice: parsedUnitPrice,
      },
    ]);

    setSelectedServiceId("");
    setUnitPrice("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (items.length === 0 || !employeeName.trim()) return;

    try {
      setLoading(true);

      await createSale({
        payment_method: paymentMethod,
        employee_name: employeeName,
        items: items.map((item) => ({
          service_id: item.service.id,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      });

      router.push("/sales");
    } catch (err) {
      console.error(err);
      alert("Failed to create sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f7faf4_0%,#ffffff_42%)] p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 rounded-[28px] border border-[#dce8cf] bg-[linear-gradient(135deg,#183f2b_0%,#275338_55%,#a7cb57_140%)] px-8 py-10 text-white shadow-[0_24px_80px_rgba(24,63,43,0.18)]">
          <span className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            New Sale
          </span>
          {/* <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Create a polished new sale in a few clicks
              </h1>
              <p className="text-sm text-white/80 md:text-base">
                Select a service, review the default price, and adjust it when
                you need a custom amount before adding it to the sale.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[260px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-white/70">Line items</p>
                <p className="mt-1 text-2xl font-semibold">{items.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-white/70">Projected total</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <section className="rounded-[28px] border border-[#e4ebdb] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Sale builder
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Add services to the basket
              </h2>
              <p className="text-sm text-gray-500">
                The custom price is for display and local totals only for now.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Service
                </span>
                <select
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-[#a7cb57]/20"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({formatCurrency(Number(service.price))})
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Quantity
                </span>
                <input
                  type="number"
                  min={1}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-[#a7cb57]/20 disabled:bg-gray-50"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  disabled={!selectedServiceId}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Unit price
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                    R
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-[#a7cb57]/20 disabled:bg-gray-50"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    disabled={!selectedServiceId}
                    placeholder="0.00"
                  />
                </div>
              </label>

              <div className="rounded-2xl border border-dashed border-[#d6e4c1] bg-[#f7fbf1] p-4">
                <p className="text-sm font-medium text-gray-700">
                  Live preview
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                      Subtotal
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(previewTotal)}
                    </p>
                  </div>
                  {selectedService && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                      Base {formatCurrency(Number(selectedService.price))}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={addItem}
              disabled={!selectedServiceId}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 font-semibold text-gray-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Add item
            </button>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 bg-[#fbfcf8] px-5 py-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Sale items</h3>
                  <p className="text-sm text-gray-500">
                    Review quantities, custom prices, and totals before saving.
                  </p>
                </div>
                <span className="rounded-full bg-[#eff6e4] px-3 py-1 text-xs font-semibold text-[#40602b]">
                  {totalItems} units
                </span>
              </div>

              {items.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-gray-500">
                  No items added yet. Choose a service above to start building
                  the sale.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <div
                      key={`${item.service.id}-${index}`}
                      className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.3fr)_110px_140px_140px_56px] md:items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Default {formatCurrency(Number(item.service.price))}
                          {item.service.is_custom ? " • Custom service" : ""}
                        </p>
                      </div>
                      <div className="text-sm text-gray-700">
                        Qty {item.quantity}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {formatCurrency(item.unitPrice)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                        aria-label={`Remove ${item.service.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#e4ebdb] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1f7e8] text-[#36502a]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Payment details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choose how this sale was paid for.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Employee
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-[#a7cb57]/20"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Payment method
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-(--color-primary) focus:ring-4 focus:ring-[#a7cb57]/20"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#e4ebdb] bg-[#fcfdf9] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <h2 className="font-semibold text-gray-900">Summary</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Items</span>
                  <span className="font-semibold text-gray-900">
                    {items.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total units</span>
                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                  <span className="text-sm font-medium text-gray-700">
                    Sale total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || items.length === 0 || !employeeName.trim()}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sidebar)] px-5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Complete sale"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Custom prices affect the on-screen sale summary only. The API
                request still sends the original service ID and quantity fields.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
