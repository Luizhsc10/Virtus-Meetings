import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] bg-[radial-gradient(circle_at_top_left,rgba(0,113,227,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,113,227,0.08),transparent_24%)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden p-6 lg:flex">
          <div className="flex w-full flex-col justify-between rounded-[2rem] border border-[#d2d2d7] bg-gradient-to-br from-white to-[#f5f5f7] p-12 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-[#d2d2d7] bg-[#f5f5f7] px-3 py-1 text-sm text-[#1d1d1f]">
                VirtusMeetings
              </div>

              <h1 className="mb-4 text-5xl font-bold leading-tight text-[#1d1d1f]">
                Connect.
                <br />
                Learn.
                <br />
                Meet smarter.
              </h1>

              <p className="max-w-xl text-base leading-7 text-[#86868b]">
                A modern video meeting and language exchange platform with a
                clean premium interface across auth, onboarding, dashboard, and
                future messaging features.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#d2d2d7] bg-white p-5">
                <p className="mb-2 text-sm text-[#86868b]">Experience</p>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Premium UI
                </h3>
              </div>

              <div className="rounded-[1.5rem] border border-[#d2d2d7] bg-white p-5">
                <p className="mb-2 text-sm text-[#86868b]">Current flow</p>
                <h3 className="text-xl font-semibold text-[#1d1d1f]">
                  Auth + Onboarding
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
