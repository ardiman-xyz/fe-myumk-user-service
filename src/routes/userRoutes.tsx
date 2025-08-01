import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

// === VERSION 1: TANPA LAZY LOADING ===
// import UserList from '@/pages/users/UserList';

// === VERSION 2: DENGAN LAZY LOADING ===
const UserList = lazy(() => import('@/pages/users/UserList'));

// Loading component untuk lazy loading
const UserPageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Loading users...</span>
    </div>
  </div>
);

export const userRoutes: RouteObject[] = [
  {
    path: 'users',
    // === VERSION 1: Direct Component (No Lazy) ===
    // element: <UserList />,
    
    // === VERSION 2: Lazy Loading dengan Suspense ===
    element: (
      <Suspense fallback={<UserPageLoader />}>
        <UserList />
      </Suspense>
    ),
  },
];

// === FUTURE: Extended Routes dengan Lazy Loading ===
/*
export const userRoutesExtended: RouteObject[] = [
  {
    path: 'users',
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<UserPageLoader />}>
            <UserList />
          </Suspense>
        ),
      },
      {
        path: 'create',
        element: (
          <Suspense fallback={<UserPageLoader />}>
            <UserCreate />
          </Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <Suspense fallback={<UserPageLoader />}>
            <UserDetail />
          </Suspense>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <Suspense fallback={<UserPageLoader />}>
            <UserEdit />
          </Suspense>
        ),
      },
    ],
  },
];
*/