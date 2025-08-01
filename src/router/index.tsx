import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";
import Login from "@/pages/auth/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboarLayout from "@/components/DashboarLayout";
import Dashboard from "@/pages/Dashboard";


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
      ]
    
  },
 
  {
    path: "*",
    element: <div>Page not found</div>
  },
]);
