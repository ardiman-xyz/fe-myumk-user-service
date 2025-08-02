import { Loader } from "lucide-react";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";

const ApplicationList = lazy(
  () => import("@/pages/application/ApplicationList")
);

const ApplicationPageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader className="animate spin-in" />
      <span className="text-gray-600">Loading application...</span>
    </div>
  </div>
);

export const applicationRoutes: RouteObject[] = [
  {
    path: "applications",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<ApplicationPageLoader />}>
            <ApplicationList />
          </Suspense>
        ),
      },
    ],
  },
];
