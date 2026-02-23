export type Role = "staff" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  unit: "page" | "minute" | "fixed";
  isActive: boolean;
}

export interface TransactionItem {
  serviceId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  grandTotal: number;
  paymentMethod: "cash" | "card";
  status: "draft" | "completed";
  createdBy: string;
  createdAt: string;
}