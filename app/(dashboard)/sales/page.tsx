// "use client";

// import { useEffect, useState } from "react";
// import { getSalesByDate } from "@/services/sales.service";
// import Link from "next/link";
// import { SalesTable } from "@/components/tables/sales-table";
// import { exportSalesToExcel } from "@/services/export.service";

// import { Calendar } from "primereact/calendar";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";

// interface Sale {
//     id: number;
//     name: string;
//     employee_id: number;
//     total_amount: string;
//     payment_method: string;
//     created_at: string;
// }

// export default function Sales(search) {
//     const [sales, setSales] = useState<Sale[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//     const [search, setSearch] = useState("");

//     const [globalFilter, setGlobalFilter] = useState("");

//     useEffect(() => {
//         const fetchSales = async () => {
//             try {
//                 const date = selectedDate
//                     ? selectedDate.toISOString().split("T")[0]
//                     : "";

//                 const data = await getSalesByDate(date);
//                 setSales(data);
//             } catch (err) {
//                 setError("Failed to load sales");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSales();
//         setGlobalFilter(search);
//     }, [selectedDate], [search]);

//     return (
//         <div className="container mx-auto">
//             <div className="mb-16">
//                 <h1 className="text-3xl font-bold">Sales - View All Sales</h1>
//             </div>
//             <div className="mb-8 flex justify-between items-center">
//                 <Link
//                     href="/sales/new"
//                     className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-6 py-3 rounded text-black font-medium"
//                 >
//                     Add New Sale +
//                 </Link>

//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-6 mx">

//                 <div className="flex items-center gap-4 mb-6">
//                     {/* Date Picker */}
//                     <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white shadow-sm">
//                         <i className="pi pi-calendar text-gray-500" />
//                         <Calendar
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.value as Date)}
//                             dateFormat="yy-mm-dd"
//                             className="border-none focus:outline-none"
//                             inputClassName="border-none focus:ring-0"
//                         />
//                     </div>

//                     {/* Search */}
//                     <div className="flex items-center flex-1 border rounded-lg px-3 py-2 bg-white shadow-sm">
//                         <i className="pi pi-search text-gray-400 mr-2" />
//                         <InputText
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search sales..."
//                             className="w-full border-none focus:ring-0"
//                         />
//                     </div>

//                     {/* Export Button */}
//                     <Button
//                         label="Export"
//                         icon="pi pi-download"
//                         onClick={() => exportSalesToExcel(sales)}
//                         className="bg-gray-800 hover:bg-black border-none px-4 py-2"
//                     />
//                 </div>

//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-700">
//                         Sales for {selectedDate?.toISOString().split("T")[0]}
//                     </h2>


//                 </div>

//                 {loading && <p>Loading...</p>}
//                 {error && <p className="text-red-500">{error}</p>}

//                 {!loading && sales.length === 0 && (
//                     <p className="text-gray-500">
//                         No transactions found.
//                     </p>
//                 )}

//                 {!loading && sales.length > 0 && (
//                     <SalesTable data={sales} search={search} />
//                 )}
//             </div>
//         </div>


//     );
// }

"use client";

import { useEffect, useState } from "react";
import { getSalesByDate } from "@/services/sales.service";
import Link from "next/link";
import { SalesTable } from "@/components/tables/sales-table";
import { exportSalesToExcel } from "@/services/export.service";

import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Search, Calendar as CalendarIcon, Download } from "lucide-react";

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

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const date = selectedDate
                    ? selectedDate.toISOString().split("T")[0]
                    : "";

                const data = await getSalesByDate(date);
                setSales(data);
            } catch (err) {
                setError("Failed to load sales");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [selectedDate]);

    return (
        <div className="container mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl text-gray-500 font-bold">Sales</h1>
                <p className="font-semibold text-gray-500">Sales Information</p>
            </div>

            <div className="mb-8 flex justify-between items-center">
                <Link
                    href="/sales/new"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-6 py-3 rounded text-black font-medium"
                >
                    + New Sale
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">

                {/* FILTER BAR */}
                <div className="flex items-center gap-4 mb-6">

                    {/* Date */}
                    <div className="relative w-[220px]">
                        {/* Icon inside input */}
                        <CalendarIcon
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <Calendar
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.value as Date)}
                            dateFormat="yy-mm-dd"
                            placeholder="Select date"
                            className="w-full"
                            inputClassName="w-full h-10 rounded-lg border-2 border-gray-300 pl-3 pr-3 focus:border-[var(--color-primary)] focus:ring-0 text-gray-500"
                            panelClassName="shadow-lg rounded-lg border border-gray-200"
                        />
                    </div>

                    {/* Search */}
                    <div className="relative w-full">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <InputText
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sales..."
                            className="w-full border-2 border-gray-300 focus:ring-0 h-10 rounded-lg pl-10 pr-2"
                        />
                    </div>

                    <button className="bg-[var(--color-sidebar)] h-10 rounded-lg text-gray-200 px-8 flex items-center gap-2"
                        onClick={() => exportSalesToExcel(sales)}>
                        <Download size={16} />
                        Export

                    </button>
                </div>

                {/* TITLE */}
                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-500">
                        Sales for : {selectedDate?.toISOString().split("T")[0]}
                    </h2>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && sales.length === 0 && (
                    <p className="text-gray-500">No transactions found.</p>
                )}

                {!loading && sales.length > 0 && (
                    <SalesTable data={sales} search={search} />
                )}
            </div>
        </div>
    );
}