import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";

export function Onboarding() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: user?.profilePic || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      fullName: form.fullName.trim(),
      bio: form.bio.trim(),
      nativeLanguage: form.nativeLanguage.trim(),
      learningLanguage: form.learningLanguage.trim(),
      location: form.location.trim(),
      profilePic: form.profilePic.trim(),
    };

    if (
      !payload.fullName ||
      !payload.bio ||
      !payload.nativeLanguage ||
      !payload.learningLanguage ||
      !payload.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await api.put("/api/users/onboarding", payload);
      await checkAuth();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Onboarding error:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm border border-[#d2d2d7]">
        <h2 className="text-2xl mb-2">Complete your profile</h2>
        <p className="text-[#86868b] mb-8">Tell us about yourself</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-xl bg-[#f5f5f7] px-4 py-3 outline-none"
          />

          <input
            type="text"
            placeholder="Native language"
            value={form.nativeLanguage}
            onChange={(e) =>
              setForm({ ...form, nativeLanguage: e.target.value })
            }
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <input
            type="text"
            placeholder="Learning language"
            value={form.learningLanguage}
            onChange={(e) =>
              setForm({ ...form, learningLanguage: e.target.value })
            }
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          <input
            type="text"
            placeholder="Profile picture URL"
            value={form.profilePic}
            onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
            className="w-full h-12 rounded-xl bg-[#f5f5f7] px-4 outline-none"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
