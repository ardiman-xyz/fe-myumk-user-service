import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";
import Login from "@/pages/auth/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import { userRoutes } from "@/routes/userRoutes";
import { roleRoutes } from "@/routes/roleRoutes";
import DashboarLayout from "@/components/DashboarLayout";
import { applicationRoutes } from "@/routes/applicationRoutes";
import { permissionRoutes } from "@/routes/permissionRoutes";

// Error Pages
import UnauthorizedPage from "@/pages/Unauthorized";
import AccountInactivePage from "@/pages/AccountInactive";

function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Root redirect
  {
    path: "/",
    element: <AuthRedirect />,
  },

  // Public routes (no auth required)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/account-inactive",
    element: <AccountInactivePage />,
  },

  // Protected routes (auth required)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      ...userRoutes,
      ...roleRoutes,
      ...applicationRoutes,
      ...permissionRoutes,
    ],
  },

  // 404 - Catch all routes
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
