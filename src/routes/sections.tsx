import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const CreateUser = lazy(() => import('src/sections/user/view/create_user'));
export const EditUser = lazy(() => import('src/sections/user/view/update_user'));
export const CompanyPage = lazy(()=>import('src/pages/company'));
export const CompanyCreate = lazy(() => import('src/sections/company/view/company-create-view'));
export const CompanyEdit = lazy(() => import('src/sections/company/view/company-update-view'));
export const GeoenchPage = lazy(()=>import('src/pages/geofench'));
export const GeofenchCreate = lazy(() => import('src/sections/geofench/view/create_gefench'));
export const GeofenchEdit = lazy(() => import('src/sections/geofench/view/update_geofench'));
export const AttendancePage = lazy(()=>import('src/pages/attendance'))
export const AttendanceRolePage = lazy(()=>import('src/pages/attendance-roles'))

export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'user/create-user', element: <CreateUser />},   
      { path: 'user/edit-user/:id', element: <EditUser /> },
      { path: 'company', element: <CompanyPage /> },
      { path: 'company/create-company', element: <CompanyCreate /> },    
      { path: 'company/edit-company/:id', element: <CompanyEdit /> },
      { path: 'geofench', element: <GeoenchPage />}, 
      { path: 'geofench/create-geofench', element: <GeofenchCreate /> },    
      { path: 'geofench/edit-geofench/:id', element: <GeofenchEdit /> }, 
      { path: 'attendance', element: <AttendancePage />}, 
      { path: 'attendance-role', element: <AttendanceRolePage />}, 
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
