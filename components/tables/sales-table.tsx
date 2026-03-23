"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

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
}

export function SalesTable({ data }: Props) {
    const columns: ColumnDef<Sale>[] = [
        {
            accessorKey: "id",
            header: "Sale ID",
            cell: ({ row }) => <span>{row.original.id}</span>,
        },
        {
            accessorKey: "name",
            header: "Sale Name",
            cell: ({ row }) => <span>{row.original.name}</span>,
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
                    R{row.original.total_amount}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
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
                        <tr
                            key={row.id}
                            className="hover:bg-gray-50 transition"
                        >
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
    );
}