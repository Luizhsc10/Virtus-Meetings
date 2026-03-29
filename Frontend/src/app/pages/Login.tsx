import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email.trim(), form.password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#d2d2d7] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-[#d2d2d7] bg-[#f5f5f7] px-3 py-1 text-sm text-[#1d1d1f]">
          Welcome back
        </div>

        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Log in</h1>
        <p className="mt-2 text-sm leading-6 text-[#86868b]">
          Access your VirtusMeetings account and continue where you left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-12 w-full rounded-xl border border-transparent bg-[#f5f5f7] px-4 outline-none transition focus:border-[rgba(0,113,227,0.35)] focus:bg-white focus:ring-4 focus:ring-[rgba(0,113,227,0.12)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#1d1d1f]">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="h-12 w-full rounded-xl border border-transparent bg-[#f5f5f7] px-4 outline-none transition focus:border-[rgba(0,113,227,0.35)] focus:bg-white focus:ring-4 focus:ring-[rgba(0,113,227,0.12)]"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#0071e3] px-4 text-sm font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[#86868b]">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-[#0071e3] hover:underline"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
