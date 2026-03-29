import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signup(fullName, email, password);
      navigate("/onboarding");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-[#d2d2d7]">
        <h2 className="text-2xl mb-2">Create account</h2>
        <p className="text-[#86868b] mb-8">Join VirtusMeetings</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[#86868b]">Already have an account? </span>
          <Link to="/login" className="text-[#0071e3] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
