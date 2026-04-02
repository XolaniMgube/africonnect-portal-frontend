// const BASE_URL = "http://localhost:5000";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { useAuthStore } from "@/store/auth.store";

export const getEmployees = async (): Promise<{ id: number; name: string; email: string; role: string }[]> => {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}/auth/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
};

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
};