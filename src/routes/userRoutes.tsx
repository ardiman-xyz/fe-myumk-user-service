import EditUserPage from '@/pages/users/EditUserPage';
import UserCreate from '@/pages/users/UserCreate';
import { Loader } from 'lucide-react';
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
      <Loader className='animate spin-in' />
      <span className="text-gray-600">Loading users...</span>
    </div>
  </div>
);


export const userRoutes: RouteObject[] = [
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
        path: ':id/edit',
        element: (
          <Suspense fallback={<UserPageLoader />}>
            <EditUserPage />
          </Suspense>
        ),
      },
      // {
      //   path: ':id/edit',
      //   element: (
      //     <Suspense fallback={<UserPageLoader />}>
      //       <UserEdit />
      //     </Suspense>
      //   ),
      // },
    ],
  },
];