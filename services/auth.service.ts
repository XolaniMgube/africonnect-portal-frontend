// const BASE_URL = "http://localhost:5000";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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