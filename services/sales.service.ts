import { useAuthStore } from "@/store/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSales = async () => {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sales");
  }

  return res.json();
};

export const createSale = async (payload: {
  payment_method: string;
  employee_name: string;
  items: { service_id: number; quantity: number; price: number }[];
}) => {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create sale");
  }

  return res.json();
};

export const getSalesByDateRange = async (startDate: string, endDate: string) => {
  const token = useAuthStore.getState().token;

  const res = await fetch(
    `${BASE_URL}/sales/date-range?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch sales by date range");
  }

  return res.json();
};

export const getSalesByDate = async (date: string) => {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}/sales/date/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sales by date");
  }

  return res.json();
};