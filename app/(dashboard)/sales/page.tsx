// "use client";

// import { useState } from "react";
// import { serviceCategories, services } from "@/services/mockData";
// import { Service } from "@/types/models";
// import { createTransaction } from "@/services/transaction.service";
// import { useAuthStore } from "@/store/auth.store";
// import { useRouter } from "next/navigation";

// interface TransactionItem {
//     service: Service;
//     quantity: number;
//     total: number;
// }

// export default function NewTransactionPage() {
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedService, setSelectedService] = useState<Service | null>(null);
//     const [quantity, setQuantity] = useState(1);
//     const [items, setItems] = useState<TransactionItem[]>([]);
//     const [paymentMethod, setPaymentMethod] = useState("cash");

//     const user = useAuthStore((state) => state.user);
//     const router = useRouter();

//     const filteredServices = services.filter(
//         (s) => s.categoryId === selectedCategory
//     );

//     const addItem = () => {
//         if (!selectedService) return;

//         const total = selectedService.price * quantity;

//         const newItem: TransactionItem = {
//             service: selectedService,
//             quantity,
//             total,
//         };

//         setItems([...items, newItem]);

//         // reset selection
//         setSelectedService(null);
//         setQuantity(1);
//     };

//     const removeItem = (index: number) => {
//         const updated = items.filter((_, i) => i !== index);
//         setItems(updated);
//     };

//     const grandTotal = items.reduce((sum, item) => sum + item.total, 0);


//     const completeTransaction = async () => {
//         if (!user || items.length === 0) return;

//         const newTransaction = {
//             id: crypto.randomUUID(),
//             items: items.map((item) => ({
//                 serviceId: item.service.id,
//                 quantity: item.quantity,
//                 unitPrice: item.service.price,
//                 total: item.total,
//             })),
//             grandTotal,
//             paymentMethod: paymentMethod as "cash" | "card",
//             status: "completed" as const,
//             createdBy: user.id,
//             createdAt: new Date().toISOString(),
//         };

//         await createTransaction(newTransaction);

//         // Reset cart
//         setItems([]);
//         setSelectedCategory("");
//         setSelectedService(null);
//         setQuantity(1);

//         router.push("/transactions");
//     };

//     return (
//         <div className="max-w-4xl bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-6">
//                 New Transaction
//             </h2>

//             {/* Service Selection */}
//             <div className="grid grid-cols-3 gap-4 mb-6">
//                 <select
//                     className="border rounded p-2"
//                     value={selectedCategory}
//                     onChange={(e) => {
//                         setSelectedCategory(e.target.value);
//                         setSelectedService(null);
//                     }}
//                 >
//                     <option value="">Category</option>
//                     {serviceCategories.map((cat) => (
//                         <option key={cat.id} value={cat.id}>
//                             {cat.name}
//                         </option>
//                     ))}
//                 </select>

//                 <select
//                     className="border rounded p-2"
//                     value={selectedService?.id || ""}
//                     onChange={(e) => {
//                         const service = services.find(
//                             (s) => s.id === e.target.value
//                         );
//                         setSelectedService(service || null);
//                     }}
//                     disabled={!selectedCategory}
//                 >
//                     <option value="">Service</option>
//                     {filteredServices.map((service) => (
//                         <option key={service.id} value={service.id}>
//                             {service.name} (R{service.price})
//                         </option>
//                     ))}
//                 </select>

//                 <input
//                     type="number"
//                     min={1}
//                     className="border rounded p-2"
//                     value={quantity}
//                     onChange={(e) => setQuantity(Number(e.target.value))}
//                     disabled={!selectedService}
//                 />
//             </div>

//             <button
//                 onClick={addItem}
//                 disabled={!selectedService}
//                 className="mb-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-4 py-2 rounded text-black font-medium"
//             >
//                 Add Item
//             </button>

//             {/* Items Table */}
//             {items.length > 0 && (
//                 <div className="mb-6">
//                     <table className="w-full border">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="text-left p-2 border">Service</th>
//                                 <th className="text-left p-2 border">Qty</th>
//                                 <th className="text-left p-2 border">Total</th>
//                                 <th className="text-left p-2 border"></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item, index) => (
//                                 <tr key={index}>
//                                     <td className="p-2 border">
//                                         {item.service.name}
//                                     </td>
//                                     <td className="p-2 border">
//                                         {item.quantity}
//                                     </td>
//                                     <td className="p-2 border">
//                                         R{item.total}
//                                     </td>
//                                     <td className="p-2 border">
//                                         <button
//                                             onClick={() => removeItem(index)}
//                                             className="text-red-500"
//                                         >
//                                             Remove
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Payment + Total */}
//             {items.length > 0 && (
//                 <div className="flex justify-between items-center border-t pt-4">
//                     <div>
//                         <label className="mr-2">Payment:</label>
//                         <select
//                             className="border rounded p-1"
//                             value={paymentMethod}
//                             onChange={(e) => setPaymentMethod(e.target.value)}
//                         >
//                             <option value="cash">Cash</option>
//                             <option value="card">Card</option>
//                         </select>
//                     </div>

//                     <div className="text-lg font-semibold">
//                         Grand Total: R{grandTotal}
//                     </div>
//                 </div>
//             )}

//             {items.length > 0 && (
//                 <button
//                     onClick={completeTransaction}
//                     className="mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-4 py-2 rounded text-black font-medium"
//                 >
//                     Complete Transaction
//                 </button>
//             )}
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { getSales } from "@/services/sales.service";
import Link from "next/link";
import { SalesTable } from "@/components/tables/sales-table";

interface Sale {
    id: number;
    name: string;
    employee_id: number;
    total_amount: string;
    payment_method: string;
    created_at: string;
}

export default function Sales() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSales();
                setSales(data);
            } catch (err) {
                setError("Failed to load sales");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="mb-16">
                <h1 className="text-3xl font-bold">Sales - View All Sales</h1>
            </div>
            <div className="mb-8">
                <Link
                    href="/sales/new"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-6 py-3 rounded text-black font-medium"
                >
                    Add New Sale +
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mx">

                <div className="flex justify-between items-center mb-4">
                    {/* <h2 className="text-xl font-semibold">
                        All Transactions
                    </h2> */}


                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && sales.length === 0 && (
                    <p className="text-gray-500">
                        No transactions found.
                    </p>
                )}

                {!loading && sales.length > 0 && (
                    <SalesTable data={sales} />
                )}
            </div>
        </div>


    );
}