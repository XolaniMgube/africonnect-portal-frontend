"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { loginRequest } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await loginRequest(email, password);

      login({
        email,
        token: data.token,
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-[400px] rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-[var(--color-sidebar)] text-center">
          Africonnect Solutions Portal
        </h1>
        <h3 className="mb-6 text-xl font-semibold text-center">Login</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Enter email"
            className="mb-4 w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            className="mb-4 w-full rounded border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="mb-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[var(--color-primary)] py-2 text-black disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}