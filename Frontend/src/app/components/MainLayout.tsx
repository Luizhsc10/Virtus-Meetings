import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/discover", label: "Discover" },
  { to: "/requests", label: "Requests" },
  { to: "/friends", label: "Friends" },
  { to: "/messages", label: "Messages" },
];

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] bg-[radial-gradient(circle_at_top_left,rgba(0,113,227,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,113,227,0.06),transparent_24%)] p-4 md:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-[#d2d2d7] bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="rounded-[1.5rem] border border-[rgba(0,113,227,0.12)] bg-[linear-gradient(135deg,rgba(0,113,227,0.08),rgba(0,113,227,0.02))] p-4">
            <div className="mb-3 inline-flex items-center rounded-full border border-[#d2d2d7] bg-white px-3 py-1 text-sm">
              VirtusMeetings
            </div>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-[#86868b]">
              {user?.fullName || "User"}
            </p>
          </div>

          <nav className="mt-5 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-[rgba(0,113,227,0.10)] font-semibold text-[#0071e3]"
                      : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-[#d2d2d7] bg-[#fbfbfc] p-4">
            <p className="mb-1 text-sm text-[#86868b]">Signed in as</p>
            <p className="mb-4 break-all text-sm font-medium text-[#1d1d1f]">
              {user?.email || "-"}
            </p>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex flex-col gap-5">
          <header className="rounded-[1.5rem] border border-[#d2d2d7] bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#1d1d1f]">
                  VirtusMeetings
                </h1>
                <p className="mt-1 text-sm text-[#86868b]">
                  Clean modern interface for your current features
                </p>
              </div>

              <div className="inline-flex w-fit items-center rounded-full border border-[#d2d2d7] bg-[#f5f5f7] px-3 py-1 text-sm text-[#1d1d1f]">
                {user?.isOnboarded ? "Onboarding complete" : "Needs onboarding"}
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
