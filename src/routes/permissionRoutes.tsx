// src/routes/permissionRoutes.tsx
import PermissionCreate from "@/pages/permissions/PermissionCreate";
import { Loader } from "lucide-react";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";

const PermissionList = lazy(() => import("@/pages/permissions/PermissionList"));

// const PermissionCreate = lazy(
//   () => import("@/pages/permissions/PermissionCreate")
// );

// const PermissionEdit = lazy(() => import("@/pages/permissions/PermissionEdit"));

// const PermissionView = lazy(() => import("@/pages/permissions/PermissionView"));

const PermissionPageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader className="animate-spin h-6 w-6" />
      <span className="text-gray-600">Loading permission...</span>
    </div>
  </div>
);

export const permissionRoutes: RouteObject[] = [
  {
    path: "permissions",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PermissionPageLoader />}>
            <PermissionList />
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<PermissionPageLoader />}>
            <PermissionCreate />
          </Suspense>
        ),
      },
      //   {
      //     path: ":id",
      //     element: (
      //       <Suspense fallback={<PermissionPageLoader />}>
      //         <PermissionView />
      //       </Suspense>
      //     ),
      //   },
      //   {
      //     path: ":id/edit",
      //     element: (
      //       <Suspense fallback={<PermissionPageLoader />}>
      //         <PermissionEdit />
      //       </Suspense>
      //     ),
      //   },
    ],
  },
];
