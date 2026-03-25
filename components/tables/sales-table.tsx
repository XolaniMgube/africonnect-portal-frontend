// "use client";

// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//     getPaginationRowModel,
//     getFilteredRowModel,
// } from "@tanstack/react-table";
// import { useState } from "react";

// interface Sale {
//     id: number;
//     name: string;
//     employee_id: number;
//     total_amount: string;
//     payment_method: string;
//     created_at: string;
// }

// interface Props {
//   data: Sale[];
//   search: string;
// }

// export function SalesTable({ data }: Props) {
//     const columns: ColumnDef<Sale>[] = [
//         {
//             accessorKey: "id",
//             header: "Sale ID",
//             cell: ({ row }) => <span>{row.original.id}</span>,
//         },
//         {
//             accessorKey: "name",
//             header: "Sale Name",
//             cell: ({ row }) => <span>{row.original.name}</span>,
//         },
//         {
//             accessorKey: "created_at",
//             header: "Date",
//             cell: ({ row }) =>
//                 new Date(row.original.created_at).toLocaleString(),
//         },
//         {
//             accessorKey: "payment_method",
//             header: "Payment",
//             cell: ({ row }) => (
//                 <span className="capitalize">
//                     {row.original.payment_method}
//                 </span>
//             ),
//         },
//         {
//             accessorKey: "total_amount",
//             header: () => <div className="text-right">Amount</div>,
//             cell: ({ row }) => (
//                 <div className="text-right font-semibold">
//                     R{row.original.total_amount}
//                 </div>
//             ),
//         },
//     ];

//     const table = useReactTable({
//         data,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         initialState: {
//             pagination: {
//                 pageSize: 10,
//             },
//         },
//         getFilteredRowModel: getFilteredRowModel(),
//     });

//     const [globalFilter, setGlobalFilter] = useState("");

//     return (
//         <>
//             <div className="overflow-hidden rounded-lg border border-gray-200">
//                 <table className="w-full text-sm">

//                     <thead className="bg-gray-50">
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <tr key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <th
//                                         key={header.id}
//                                         className="text-left px-4 py-3 font-medium text-gray-600"
//                                     >
//                                         {flexRender(
//                                             header.column.columnDef.header,
//                                             header.getContext()
//                                         )}
//                                     </th>
//                                 ))}
//                             </tr>
//                         ))}
//                     </thead>

//                     <tbody className="divide-y divide-gray-100">
//                         {table.getRowModel().rows.map((row) => (
//                             <tr
//                                 key={row.id}
//                                 className="hover:bg-gray-50 transition"
//                             >
//                                 {row.getVisibleCells().map((cell) => (
//                                     <td
//                                         key={cell.id}
//                                         className="px-4 py-3 text-gray-700"
//                                     >
//                                         {flexRender(
//                                             cell.column.columnDef.cell,
//                                             cell.getContext()
//                                         )}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>

//                 </table>

//             </div>
//             <div className="flex justify-end items-center gap-2 mt-4">
//                 <button
//                     onClick={() => table.previousPage()}
//                     disabled={!table.getCanPreviousPage()}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                     Previous
//                 </button>

//                 <span className="text-sm text-gray-600">
//                     Page{" "}
//                     <strong>
//                         {table.getState().pagination.pageIndex + 1}
//                     </strong>{" "}
//                     of {table.getPageCount()}
//                 </span>

//                 <button
//                     onClick={() => table.nextPage()}
//                     disabled={!table.getCanNextPage()}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </>
//     );
// }

"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ExternalLink, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface Sale {
    id: number;
    name: string;
    employee_id: number;
    total_amount: string;
    payment_method: string;
    created_at: string;
}

interface Props {
    data: Sale[];
    search: string;
}

export function SalesTable({ data, search }: Props) {
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        setGlobalFilter(search);
    }, [search]);

    const columns: ColumnDef<Sale>[] = [
        {
            accessorKey: "id",
            header: "Sale ID",
        },
        {
            accessorKey: "name",
            header: "Sale Name",
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) =>
                new Date(row.original.created_at).toLocaleString(),
        },
        {
            accessorKey: "payment_method",
            header: "Payment",
            cell: ({ row }) => (
                <span className="capitalize">
                    {row.original.payment_method}
                </span>
            ),
        },
        {
            accessorKey: "total_amount",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => (
                <div className="text-right font-semibold">
                    R{Number(row.original.total_amount).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <button className="text-blue-500 hover:underline">
                       <ExternalLink />
                    </button>
                    <button className="text-red-500 hover:underline">
                        <Trash />
                    </button>
                </div>
            ),
        }
    ];

    const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
        const value = Object.values(row.original).join(" ").toLowerCase();
        return value.includes(filterValue.toLowerCase());
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        globalFilterFn,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">

                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="text-left px-4 py-3 font-medium text-gray-600"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-3 text-gray-700"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-2 mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-1 py-1 border rounded-3xl disabled:opacity-50"
                >
                    <ChevronLeft />
                </button>

                <span className="text-sm text-gray-600">
                    Page{" "}
                    <strong>
                        {table.getState().pagination.pageIndex + 1}
                    </strong>{" "}
                    of {table.getPageCount()}
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-1 py-1 border rounded-3xl disabled:opacity-50"
                >
                    <ChevronRight />
                </button>
            </div>
        </>
    );
}