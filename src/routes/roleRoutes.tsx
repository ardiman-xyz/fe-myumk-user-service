import { Loader } from "lucide-react";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";

const RoleList = lazy(() => import("@/pages/roles/RolesList"));
const AddRolePage = lazy(() => import("@/pages/roles/AddRolePage"));
const EditUserPage = lazy(() => import("@/pages/roles/RoleEdit"));

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
      {
        path: ":id/edit",
        element: (
          <Suspense fallback={<Loader className="animate-spin h-6 w-6" />}>
            <EditUserPage />
          </Suspense>
        ),
      },
    ],
  },
];
