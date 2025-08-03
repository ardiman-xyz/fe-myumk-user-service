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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: <Login />,
  },
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
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    ),
  },
]);
