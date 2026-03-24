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