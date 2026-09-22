import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate  } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import CompanyUpdateView from 'src/sections/company/view/company-update-view';

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
export const RolePage = lazy(() => import('src/pages/roles'));
export const CreateRole = lazy(() => import('src/sections/roles/view/create_role'));
export const EditRole = lazy(() => import('src/sections/roles/view/update_role'));
export const AssignRole = lazy(() => import('src/sections/roles/view/assign_role'));
export const Permissions = lazy(() => import('src/pages/permissions'));
export const CreatePermission = lazy(() => import('src/sections/permissions/view/create_permission'));
export const EditPermission = lazy(() => import('src/sections/permissions/view/update_permission'));
export const AssignPermission = lazy(() => import('src/sections/permissions/view/permission_assign'));
export const GeofenchCreate = lazy(() => import('src/sections/geofench/view/create_gefench'));
export const GeofenchEdit = lazy(() => import('src/sections/geofench/view/update_geofench'));
export const AttendancePage = lazy(()=>import('src/pages/attendance'))
export const AttendanceRolePage = lazy(()=>import('src/pages/attendance-roles'))
export const AttendanceRoleCreate = lazy(()=>import('src/pages/attendance-roles'))
export const EmployeeTrackingPage = lazy(()=>import('src/pages/employee-location'))
export const EmployeeTrackingMap = lazy(()=> import('src/pages/employee-location-map-view'))
// Hiearchy
export const Country = lazy(()=>import('src/sections/hierarchy/country/view/country_view'));
export const CreateCountry = lazy(() => import('../sections/hierarchy/country/view/create_country'));
export const EditCountry = lazy(() => import('../sections/hierarchy/country/view/update_country'));
export const Region = lazy(()=> import('src/sections/hierarchy/region/view/region_view'));
export const CreateRegion = lazy(() => import('../sections/hierarchy/region/view/create_region'));
export const EditRegion = lazy(() => import('../sections/hierarchy/region/view/update_region'));
export const Zone = lazy(()=> import('src/sections/hierarchy/zone/view/zone_view'));
export const CreateZone = lazy(() => import('../sections/hierarchy/zone/view/create_zone'));
export const EditZone = lazy(() => import('../sections/hierarchy/zone/view/update_zone'));
export const Division = lazy(()=> import('src/sections/hierarchy/division/view/division_view'));
export const CreateDivision = lazy(() => import('../sections/hierarchy/division/view/create_division'));
export const EditDivision = lazy(() => import('../sections/hierarchy/division/view/update_division'));
export const District = lazy(()=> import('src/sections/hierarchy/district/view/district_view'));
export const CreateDistrict = lazy(() => import('../sections/hierarchy/district/view/create_district'));
export const EditDistrict = lazy(() => import('../sections/hierarchy/district/view/update_district'));
export const SubDistrict = lazy(()=> import('src/sections/hierarchy/sub_district/view/sub_district_view'));
export const CreateSubDistrict = lazy(() => import('../sections/hierarchy/sub_district/view/create_sub_district'));
export const EditSubDistrict = lazy(() => import('../sections/hierarchy/sub_district/view/update_sub_district'));
export const Territory = lazy(()=> import('src/sections/hierarchy/territory/view/territory_view'));
export const CreateTerritory = lazy(() => import('../sections/hierarchy/territory/view/create_territory'));
export const EditTerritory = lazy(() => import('../sections/hierarchy/territory/view/update_territory'));
export const Area = lazy(()=> import('src/sections/hierarchy/area/view/area_view'));
export const CreateArea = lazy(() => import('../sections/hierarchy/area/view/create_area'));
export const EditArea = lazy(() => import('../sections/hierarchy/area/view/update_area'));
export const AssignHierarchy = lazy(() => import('src/sections/hierarchy/hierarchyAssign/hierarchy_assign'));


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
      { index: true, element: <Navigate to="/sign-in" replace /> },
      { path: 'roles', element: <RolePage />},
      { path: 'roles/create-role', element: <CreateRole />},   
      { path: 'roles/edit-role/:id', element: <EditRole /> },
      { path: 'roles/assign-role', element: <AssignRole />},
      { path: 'permissions', element: <Permissions />},
      { path: 'permissions/create-permission', element: <CreatePermission />},   
      { path: 'permissions/edit-permission/:id', element: <EditPermission /> },
      { path: 'permissions/assign-permission', element: <AssignPermission /> },
      { path: 'dashboard', element: <DashboardPage /> },
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
      { path: 'employee-location', element: <EmployeeTrackingPage />}, 
      { path: 'employee-location-map', element: <EmployeeTrackingMap />},
      { path: 'hierarchy/country', element: <Country />},
      { path: 'hierarchy/create-country', element: <CreateCountry />},
      { path: 'hierarchy/edit-country/:id', element: <EditCountry />},
      { path: 'hierarchy/region', element: <Region />},
      { path: 'hierarchy/create-region', element: <CreateRegion />},
      { path: 'hierarchy/edit-region/:id', element: <EditRegion />},
      { path: 'hierarchy/zone', element: <Zone />},
      { path: 'hierarchy/create-zone', element: <CreateZone />},
      { path: 'hierarchy/edit-zone/:id', element: <EditZone />},
      { path: 'hierarchy/division', element: <Division />},
      { path: 'hierarchy/create-division', element: <CreateDivision />},
      { path: 'hierarchy/edit-division/:id', element: <EditDivision />},
      { path: 'hierarchy/district', element: <District />},
      { path: 'hierarchy/create-district', element: <CreateDistrict />},
      { path: 'hierarchy/edit-district/:id', element: <EditDistrict />},
      { path: 'hierarchy/sub-district', element: <SubDistrict />},
      { path: 'hierarchy/create-sub-district', element: <CreateSubDistrict />},
      { path: 'hierarchy/edit-sub-district/:id', element: <EditSubDistrict />},
      { path: 'hierarchy/territory', element: <Territory />},
      { path: 'hierarchy/create-territory', element: <CreateTerritory />},
      { path: 'hierarchy/edit-territory/:id', element: <EditTerritory />},
      { path: 'hierarchy/area', element: <Area />},
      { path: 'hierarchy/create-area', element: <CreateArea />},
      { path: 'hierarchy/edit-area/:id', element: <EditArea />},
      { path: 'assign-hierarchy', element: <AssignHierarchy />},
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
