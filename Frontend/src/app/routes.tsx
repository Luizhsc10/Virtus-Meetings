import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "./components/AuthLayout";
import { MainLayout } from "./components/MainLayout";
import { useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Onboarding } from "./pages/Onboarding";
import { Signup } from "./pages/Signup";

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f5f7] p-6">
      <div className="rounded-[2rem] border border-[#d2d2d7] bg-white px-8 py-6 shadow-sm">
        <p className="text-sm text-[#86868b]">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isOnboarded) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isOnboarded) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user && user.isOnboarded) return <Navigate to="/dashboard" replace />;
  if (user && !user.isOnboarded) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-[2rem] border border-[#d2d2d7] bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#1d1d1f]">{title}</h2>
      <p className="mt-2 text-sm text-[#86868b]">
        This page is ready for styling and feature implementation.
      </p>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthRoute>
            <Signup />
          </AuthRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        ),
      },
    ],
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/discover",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Discover" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/requests",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Friend Requests" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/friends",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Friends" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Messages" />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
