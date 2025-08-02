import AddRolePage from "@/pages/roles/AddRolePage";
import EditUserPage from "@/pages/users/EditUserPage";
import UserCreate from "@/pages/users/UserCreate";
import { Loader } from "lucide-react";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";

const RoleList = lazy(() => import("@/pages/roles/RolesList"));

const RolesPageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader className="animate spin-in" />
      <span className="text-gray-600">Loading roles...</span>
    </div>
  </div>
);

export const roleRoutes: RouteObject[] = [
  {
    path: "roles",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RolesPageLoader />}>
            <RoleList />
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<RolesPageLoader />}>
            <AddRolePage />
          </Suspense>
        ),
      },
    ],
  },
];
