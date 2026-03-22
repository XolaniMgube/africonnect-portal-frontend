import { useAuthStore } from "@/store/auth.store";

export const getSales = async () => {
  const token = useAuthStore.getState().token;

  const res = await fetch("http://localhost:5000/sales", {
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
  items: { service_id: number; quantity: number }[];
}) => {
  const token = useAuthStore.getState().token;

  const res = await fetch("http://localhost:5000/sales", {
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