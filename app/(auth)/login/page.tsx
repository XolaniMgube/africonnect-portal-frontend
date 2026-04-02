"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { loginRequest } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[linear-gradient(135deg,#0f2318_0%,#183f2b_45%,#1d4d33_100%)]">
      {/* Left panel — branding */}
      <div className="hidden flex-col justify-between p-12 lg:flex lg:w-1/2">
        <div>
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Africonnect Solutions
          </span>
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
            Your operations,<br />
            <span className="text-[#a7cb57]">one place.</span>
          </h1>
          <p className="text-base leading-7 text-white/60">
            Track sales, manage your team, and get clear on the numbers — all
            from a single, focused dashboard.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: "Sales tracking", desc: "Daily & historical" },
              { label: "Team management", desc: "Roles & access" },
              { label: "Reports", desc: "Insights & exports" },
              { label: "Fast & secure", desc: "Token-based auth" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="font-semibold text-white">{item.label}</p>
                <p className="mt-0.5 text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Africonnect Solutions. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:bg-[linear-gradient(180deg,#f4f8ef_0%,#ffffff_40%)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Africonnect Solutions
            </span>
          </div>

          <div className="rounded-[32px] border border-[#e4ebdb] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.10)] md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-500">
                Sign in to your portal account
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="you@africonnect.co.za"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a7cb57] focus:bg-white focus:ring-4 focus:ring-[#a7cb57]/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a7cb57] focus:bg-white focus:ring-4 focus:ring-[#a7cb57]/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#183f2b_0%,#2a6040_100%)] font-semibold text-white shadow-[0_8px_24px_rgba(24,63,43,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
