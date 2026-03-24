"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/services/services.service";
import { createSale } from "@/services/sales.service";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  price: string;
  is_custom: boolean;
}

interface Item {
  service: Service;
  quantity: number;
}

export default function CreateNewSalePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
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

    fetchServices();
  }, []);

  const selectedService = services.find(
    (s) => s.id === Number(selectedServiceId)
  );

  const addItem = () => {
    if (!selectedService) return;

    setItems((prev) => [
      ...prev,
      { service: selectedService, quantity },
    ]);

    setSelectedServiceId("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => {
    return sum + Number(item.service.price) * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    if (items.length === 0) return;

    try {
      setLoading(true);

      await createSale({
        payment_method: paymentMethod,
        items: items.map((item) => ({
          service_id: item.service.id,
          quantity: item.quantity,
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
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Create New Sale
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Select sale requirements
          </h2>

          {/* Selection Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <select
              className="border rounded p-2"
              value={selectedServiceId}
              onChange={(e) =>
                setSelectedServiceId(e.target.value)
              }
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} (R{service.price})
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              className="border rounded p-2"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              disabled={!selectedServiceId}
            />

            <button
              onClick={addItem}
              disabled={!selectedServiceId}
              className="bg-[var(--color-primary)] px-4 py-2 rounded font-medium"
            >
              Add Item
            </button>
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div className="mb-6">
              <table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Service</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        {item.service.name}
                      </td>
                      <td className="p-2">
                        {item.quantity}
                      </td>
                      <td className="p-2">
                        R
                        {(
                          Number(item.service.price) *
                          item.quantity
                        ).toFixed(2)}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() =>
                            removeItem(index)
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payment + Total */}
          {items.length > 0 && (
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <label className="mr-2">Payment:</label>
                <select
                  className="border rounded p-1"
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div className="font-semibold text-lg">
                Total: R{total.toFixed(2)}
              </div>
            </div>
          )}

          {/* Submit */}
          {items.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 bg-[var(--color-primary)] px-4 py-2 rounded font-medium"
            >
              {loading ? "Creating..." : "Complete Sale"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}