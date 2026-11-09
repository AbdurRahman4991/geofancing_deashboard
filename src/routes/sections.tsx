import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate  } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import CompanyUpdateView from 'src/sections/company/view/company-update-view';
import { ProtectedRoute } from '../../src/routes/components/protected-route';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const Employee = lazy(() => import('src/pages/employee'));
export const Notification = lazy(() => import('src/sections/notification/view/view-notification'));
export const CreateEmployee = lazy(() => import('src/sections/employee/view/create_employee'));
export const EditEmployee = lazy(() => import('src/sections/employee/view/update_employee'));
export const User = lazy(() => import('src/pages/users'));
export const CreateUser = lazy(() => import('src/sections/users/view/create_user'));
export const EditUser = lazy(() => import('src/sections/users/view/update_user'));
export const CompanyPage = lazy(()=>import('src/pages/company'));
export const CompanyCreate = lazy(() => import('src/sections/company/view/company-create-view'));
export const CompanyEdit = lazy(() => import('src/sections/company/view/company-update-view'));
export const Department = lazy(()=>import('src/pages/department'));
export const DepartmentCreate = lazy(() => import('src/sections/department/view/create-department'));
export const DepartmentEdit = lazy(() => import('src/sections/department/view/update-department'));
export const GeoenchPage = lazy(()=>import('src/pages/geofench'));
export const RolePage = lazy(() => import('src/pages/roles'));
export const CreateRole = lazy(() => import('src/sections/roles/view/create_role'));
export const EditRole = lazy(() => import('src/sections/roles/view/update_role'));
export const AssignRole = lazy(() => import('src/sections/roles/view/assign_role'));
export const AssignRoleList = lazy(() => import('src/sections/roles/view/assign-role-list'));
export const Permissions = lazy(() => import('src/pages/permissions'));
export const CreatePermission = lazy(() => import('src/sections/permissions/view/create_permission'));
export const EditPermission = lazy(() => import('src/sections/permissions/view/update_permission'));
export const AssignPermission = lazy(() => import('src/sections/permissions/view/permission_assign'));
export const GeofenchCreate = lazy(() => import('src/sections/geofench/view/create_gefench'));
export const GeofenchEdit = lazy(() => import('src/sections/geofench/view/update_geofench'));
export const AttendancePage = lazy(()=>import('src/pages/attendance'))
export const AttendanceEdit = lazy(() => import('src/sections/attendance/view/update_user'));
export const AttendanceRolePage = lazy(()=>import('src/pages/attendance-roles'))
export const AttendanceRoleCreate = lazy(()=>import('src/sections/attendance-roles/view/create-attendance-role'))
export const AttendanceRoleEdit = lazy(()=>import('src/sections/attendance-roles/view/update-attendance-role'))
export const EmployeeTrackingPage = lazy(()=>import('src/pages/employee-location'))
export const EmployeeTrackingMap = lazy(()=> import('src/pages/employee-location-map-view'))
export const EmployeeLiveLocation = lazy(()=> import('src/pages/employee-live-location-view'))
// Hiearchy
export const Level = lazy(()=> import('src/sections/hierarchy/level/view/view-level'));
export const CreateLevel = lazy(() => import('../sections/hierarchy/level/view/create-level'));
export const EditLevel = lazy(() => import('../sections/hierarchy/level/view/update-level'));
export const Node = lazy(()=> import('src/sections/hierarchy/node/view/node-view'));
export const CreateNode = lazy(() => import('../sections/hierarchy/node/view/create-node'));
export const EditNode = lazy(() => import('../sections/hierarchy/node/view/update-node'));
export const AssignNode = lazy(() => import('src/sections/hierarchy/node-assign/view/view-node-assign'));
export const CreateAssignNode = lazy(() => import('src/sections/hierarchy/node-assign/view/create-node-assign'));
export const EditAssignNode = lazy(() => import('src/sections/hierarchy/node-assign/view/update-node-assign'));

export const Category = lazy(()=> import('src/sections/product/category/view/category-view'));
export const CreateCategory = lazy(() => import('src/sections/product/category/view/create-category'));
export const EditCategory = lazy(() => import('src/sections/product/category/view/update-category'));
export const Brand = lazy(() => import('src/sections/product/brand/view/view-brand'));

export const SubCategory = lazy(()=> import('src/sections/product/sub-category/view/sub-category-view'));
export const CreateSubCategory = lazy(() => import('src/sections/product/sub-category/view/create-sub-category'));
export const EditSubCategory = lazy(() => import('src/sections/product/sub-category/view/update-sub-category'));

export const brand = lazy(()=> import('src/sections/product/brand/view/view-brand'));
export const CreateBrand = lazy(() => import('src/sections/product/brand/view/create-brand'));
export const EditBrand = lazy(() => import('src/sections/product/brand/view/update-brand'));

export const Units = lazy(()=> import('src/sections/product/units/view/view-units'));
export const CreateUnit = lazy(() => import('src/sections/product/units/view/create-units'));
export const EditUnit = lazy(() => import('src/sections/product/units/view/update-units'));

export const Product = lazy(()=> import('src/sections/product/new-product/view/view-product'));
export const CreatProduct = lazy(() => import('src/sections/product/new-product/view/create-product'));
export const EdiProduct = lazy(() => import('src/sections/product/new-product/view/update-product'));

export const ProductStock = lazy(()=> import('src/sections/product/product-stock/view/view-product-stock'));
export const CreatProductStock = lazy(() => import('src/sections/product/product-stock/view/create-product-stock'));
export const EdiProductStock = lazy(() => import('src/sections/product/product-stock/view/update-product-stock'));

export const ProductPrice = lazy(()=> import('src/sections/product/product-price/view/view-product-price'));
export const CreatProductPrice = lazy(() => import('src/sections/product/product-price/view/create-product-price'));
export const EdiProductPrice = lazy(() => import('src/sections/product/product-price/view/update-product-price'));
export const Catalog = lazy(() => import('src/sections/product/new-product/view/catalog'));
export const DailyOrderSummary = lazy(() => import('src/sections/report/daily-order-summary'));
export const DailyAttendanceReport = lazy(() => import('src/sections/report/daily-attendance-report'));
export const EmployeeAttendanceSummary = lazy(() => import('src/sections/report/employee-attendance-summary'));
export const EmployeeVisitReport = lazy(() => import('src/sections/report/employee-visit-report'));
export const MonthlyPerformanceReport = lazy(() => import('src/sections/report/monthly-performance-report'));
export const GeofenceMapReport = lazy(() => import('src/sections/report/geofence-map-report'));

export const Order = lazy(()=> import('src/sections/product/order/view/order-view'));
export const CreatOrder = lazy(() => import('src/sections/product/product-price/view/create-product-price'));
export const EdiOrder = lazy(() => import('src/sections/product/product-price/view/update-product-price'));


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
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <DashboardLayout>
            <Suspense fallback={renderFallback()}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'notification', element: <Notification /> },
          { path: 'roles', element: <RolePage /> },
          { path: 'roles/create-role', element: <CreateRole /> },
          { path: 'roles/edit-role/:id', element: <EditRole /> },
          { path: 'roles/assign-role', element: <AssignRole /> },
          { path: 'roles/assign-role-list', element: <AssignRoleList /> },
          { path: 'permissions', element: <Permissions /> },
          { path: 'permissions/create-permission', element: <CreatePermission /> },
          { path: 'permissions/edit-permission/:id', element: <EditPermission /> },
          { path: 'permissions/assign-permission', element: <AssignPermission /> },
          { path: 'dashboard', element: <DashboardPage /> },

          { path: 'employee', element: <Employee /> },
          { path: 'employee/create-employee', element: <CreateEmployee /> },
          { path: 'employee/edit-employee/:id', element: <EditEmployee /> },

          { path: 'users', element: <User /> },
          { path: 'users/create-user', element: <CreateUser /> },
          { path: 'users/edit-user/:id', element: <EditUser /> },

          { path: 'company', element: <CompanyPage /> },
          { path: 'company/create-company', element: <CompanyCreate /> },
          { path: 'company/edit-company/:id', element: <CompanyEdit /> },

          { path: 'department', element: <Department /> },
          { path: 'department/create-department', element: <DepartmentCreate /> },
          { path: 'department/edit-department/:id', element: <DepartmentEdit /> },          

          { path: 'geofench', element: <GeoenchPage /> },
          { path: 'geofench/create-geofench', element: <GeofenchCreate /> },
          { path: 'geofench/edit-geofench/:id', element: <GeofenchEdit /> },

          { path: 'attendance', element: <AttendancePage /> },
          { path: 'attendance/edit/:id', element: <AttendanceEdit /> },
          { path: 'attendance-role', element: <AttendanceRolePage /> },
          { path: 'create/attendance-role', element: <AttendanceRoleCreate /> },
          { path: 'edit/attendance-role/:id', element: <AttendanceRoleEdit /> },

          { path: 'employee-location', element: <EmployeeTrackingPage /> },
          { path: 'employee-location-map', element: <EmployeeTrackingMap /> },
          { path: 'employee-live-location', element: <EmployeeLiveLocation /> },

          { path: 'hierarchy/level', element: <Level /> },
          { path: 'hierarchy/create-level', element: <CreateLevel /> },
          { path: 'hierarchy/edit-level/:id', element: <EditLevel /> },
          { path: 'hierarchy/node', element: <Node /> },
          { path: 'hierarchy/create-node', element: <CreateNode /> },
          { path: 'hierarchy/edit-node/:id', element: <EditNode /> },                    
          { path: 'assign-node', element: <AssignNode /> },
          { path: 'create/assign-node', element: <CreateAssignNode /> },
          { path: 'edit/assign-node/:id', element: <EditAssignNode /> },

          { path: 'category', element: <Category /> },
          { path: 'create/category', element: <CreateCategory /> },
          { path: 'edit/edit-category/:id', element: <EditCategory /> },
          { path: 'sub-category', element: <SubCategory /> },
          { path: 'create/sub-category', element: <CreateSubCategory /> },
          { path: 'edit/edit-sub-category/:id', element: <EditSubCategory /> },      
          { path: 'brand', element: <Brand /> },
          { path: 'create/brand', element: <CreateBrand /> },
          { path: 'edit/brand/:id', element: <EditBrand /> },   
          { path: 'unit', element: <Units /> },
          { path: 'create/unit', element: <CreateUnit /> },
          { path: 'edit/unit/:id', element: <EditUnit /> },    
          { path: 'product', element: <Product /> },
          { path: 'create/product', element: <CreatProduct /> },
          { path: 'edit/product/:id', element: <EdiProduct /> }, 
          { path: 'product-stock', element: <ProductStock /> },
          { path: 'create/product-stock', element: <CreatProductStock /> },
          { path: 'edit/product-stock/:id', element: <EdiProductStock /> },
          { path: 'product-price', element: <ProductPrice /> },
          { path: 'create/product-price', element: <CreatProductPrice /> },
          { path: 'edit/product-price/:id', element: <EdiProductPrice /> },
          {path: 'catalog', element: <Catalog />},
          { path: 'report/daily-order-summary', element: <DailyOrderSummary /> },
          { path: 'report/daily-attendance-report', element: <DailyAttendanceReport /> },
          { path: 'report/employee-attendance-summary', element: <EmployeeAttendanceSummary /> },
          { path: 'report/employee-visit-report', element: <EmployeeVisitReport /> },
          { path: 'report/monthly-performance-report', element: <MonthlyPerformanceReport /> },
          { path: 'report/geofence-map', element: <GeofenceMapReport /> },
          { path: 'order', element: <Order /> },
          { path: 'create/order', element: <CreatOrder /> },
          { path: 'edit/order/:id', element: <EdiOrder /> },          

          { path: 'products', element: <ProductsPage /> },
          { path: 'blog', element: <BlogPage /> },
        ],
      },
    ],
  },

  // Public route
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },

  // Public route
  {
    path: '404',
    element: <Page404 />,
  },

  // Public route
  {
    path: '*',
    element: <Page404 />,
  },
];



