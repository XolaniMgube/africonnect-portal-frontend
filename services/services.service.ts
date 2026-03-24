import { useAuthStore } from "@/store/auth.store";

// const BASE_URL = "http://localhost:5000";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getServices = async () => {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};