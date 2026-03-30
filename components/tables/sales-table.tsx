"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ExternalLink, Trash } from "lucide-react";

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

export function SalesTable({ data, search }: Props) {
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setGlobalFilter(search);
  }, [search]);

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "id",
      header: "Sale ID",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.original.name || "Walk-in customer"}
          </p>
          <p className="text-xs text-gray-500">
            Employee #{row.original.employee_id}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">
          {new Date(row.original.created_at).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Payment",
      cell: ({ row }) => (
        <span className="inline-flex rounded-full bg-[#eff6e4] px-3 py-1 text-xs font-semibold capitalize text-[#35512a]">
          {row.original.payment_method}
        </span>
      ),
    },
    {
      accessorKey: "total_amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-gray-900">
          {formatCurrency(Number(row.original.total_amount))}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: () => (
        <div className="flex justify-end gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 text-blue-500 transition hover:bg-blue-50"
            aria-label="View sale"
          >
            <ExternalLink size={16} />
          </button>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
            aria-label="Delete sale"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const globalFilterFn = (row: { original: Sale }, _: string, filterValue: string) => {
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
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-[24px] border border-[#e8edde]">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-[#fbfcf8]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500"
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

          <tbody className="divide-y divide-[#eef2e8] bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition hover:bg-[#fbfdf8]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} filtered result(s)
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm text-gray-600">
            Page{" "}
            <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
