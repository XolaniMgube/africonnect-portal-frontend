"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/services/mockData";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
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

      const data = await res.json();

      login({
        email,
        token: data.token,
      });

      console.log("Logged in user:", { email, token: data.token });

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-[400px] rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold">
          Africonnect Login
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="mb-4 w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="mb-3 text-sm text-red-500">
            {error}
          </p>
        )}

        <input
          type="password"
          placeholder="Enter password"
          className="mb-4 w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full rounded bg-black py-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}