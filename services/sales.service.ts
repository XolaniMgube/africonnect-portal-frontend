import { useAuthStore } from "@/store/auth.store";

export const getSales = async () => {
  const token = useAuthStore.getState().token;

  const res = await fetch("https://internet-cafe-pos-1.onrender.com/sales", {
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

  const res = await fetch("https://internet-cafe-pos-1.onrender.com/sales", {
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