export type Role = "staff" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  // token?: any;
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
  items: {
    serviceId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  grandTotal: number;
  paymentMethod: "cash" | "card";
  status: "completed";
  createdBy: string;
  createdAt: string;
}