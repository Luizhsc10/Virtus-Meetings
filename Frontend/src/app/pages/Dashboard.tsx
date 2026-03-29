import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profileFields = [
    user?.fullName,
    user?.email,
    user?.bio,
    user?.nativeLanguage,
    user?.learningLanguage,
    user?.location,
  ];

  const completedFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <section className="rounded-[2rem] border border-[#d2d2d7] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#1d1d1f]">
          Profile card
        </h2>

        <div className="flex flex-col items-center text-center">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.fullName || "Profile"}
              className="mb-4 h-24 w-24 rounded-full border border-[#d2d2d7] object-cover"
            />
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[#d2d2d7] bg-[#f5f5f7] text-2xl font-semibold text-[#1d1d1f]">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <h3 className="text-lg font-semibold text-[#1d1d1f]">
            {user?.fullName || "-"}
          </h3>
          <p className="mt-1 text-sm text-[#86868b]">{user?.email || "-"}</p>
          <p className="mt-4 text-sm leading-6 text-[#1d1d1f]">
            {user?.bio || "No bio added yet."}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#d2d2d7] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#1d1d1f]">
          Profile details
        </h2>

        <div className="space-y-3 text-sm text-[#1d1d1f]">
          <p>
            <span className="font-medium">Full name:</span>{" "}
            {user?.fullName || "-"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user?.email || "-"}
          </p>
          <p>
            <span className="font-medium">Bio:</span> {user?.bio || "-"}
          </p>
          <p>
            <span className="font-medium">Native language:</span>{" "}
            {user?.nativeLanguage || "-"}
          </p>
          <p>
            <span className="font-medium">Learning language:</span>{" "}
            {user?.learningLanguage || "-"}
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            {user?.location || "-"}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#d2d2d7] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#1d1d1f]">
          Quick status
        </h2>

        <div className="space-y-4 text-sm text-[#1d1d1f]">
          <p>
            <span className="font-medium">Account status:</span> Active
          </p>
          <p>
            <span className="font-medium">Onboarding:</span>{" "}
            {user?.isOnboarded ? "Completed" : "Pending"}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user?._id || "-"}
          </p>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Profile completion</span>
              <span>{profileCompletion}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-[#f5f5f7]">
              <div
                className="h-3 rounded-full bg-[#0071e3] transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="w-full rounded-xl border border-[#d2d2d7] px-4 py-3 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
          >
            Edit profile
          </button>
        </div>
      </section>
    </div>
  );
}
