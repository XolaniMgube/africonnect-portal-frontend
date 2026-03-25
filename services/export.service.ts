import * as XLSX from "xlsx";

interface Sale {
  id: number;
  name: string;
  employee_id: number;
  total_amount: string;
  payment_method: string;
  created_at: string;
}

export const exportSalesToExcel = (sales: Sale[]) => {
  // Transform data (clean it for users)
  const formattedData = sales.map((sale) => ({
    "Sale ID": sale.id,
    "Name": sale.name || "-",
    "Date": new Date(sale.created_at).toLocaleString(),
    "Payment Method": sale.payment_method,
    "Amount (R)": sale.total_amount,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

  // Download file
  XLSX.writeFile(workbook, "sales.xlsx");
};