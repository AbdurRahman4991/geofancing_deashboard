import { patch } from '@mui/material';
//import { title } from 'process';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: NavItem[];
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'HRIS',
    path: '/hris',
    icon: icon('ic-analytics'),

    children: [
        {
          title: 'Company',
          path: '/company',
          icon: icon('ic-user'),
        },
        {
          title: 'Department',
          path: '/department',
          icon: icon('ic-user'),
        },                      
        {
          title: 'Employee',
          path: '/employee',
          icon: icon('ic-user'),
        },
        {
          title: 'User',
          path: '/users',
          icon: icon('ic-user'),
        },
        {
          title: 'Attendance Role',
          path: '/attendance-role',
          icon: icon('ic-cart'),
        },         
        {
          title: 'Attendance',
          path: '/attendance',
          icon: icon('ic-cart'),
        },             
     ],
   },  
  {
    title: 'Access control',
    path: '/access-control',
    icon: icon('ic-analytics'),

  children: [
    {
      title: 'Roles',
      path: '/roles',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Assign Roles',
      path: '/roles/assign-role',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Assigned Roles List',
      path: '/roles/assign-role-list',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Permissions',
      path: '/permissions',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Assign Permissions',
      path: '/permissions/assign-permission',
      icon: icon('ic-analytics'),
    },
    ],
  },  
 

  // ------------------------------------------------
  // HIERARCHY DROPDOWN
  // ------------------------------------------------

  {
    title: 'Hierarchy',
    path: '/hierarchy',
    icon: icon('ic-analytics'),

    children: [        
      {
        title: 'Hierarchy Level',
        path: '/hierarchy/level',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Hierarchy Node',
        path: '/hierarchy/node',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Assign Node',
        path: '/assign-node',
        icon: icon('ic-analytics'),
      },        
     ],
   },

  {
    title: 'Market',
    path: '/geofench',
    icon: icon('ic-cart'),

  },
  {
    title: 'Order',
    path: '/order',
    icon: icon('ic-cart'),

  },  

  {
    title: 'Product',
    path: '/product',
    icon: icon('ic-analytics'),

  children: [
    {
      title: 'Category',
      path: '/category',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Sub-category',
      path: '/sub-category',
      icon: icon('ic-analytics'),
    },    
    {
      title: 'Brand',
      path: '/brand',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Unit',
      path: '/unit',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Product',
      path: '/product',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Product Stock',
      path: '/product-stock',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Product Pricing',
      path: '/product-price',
      icon: icon('ic-analytics'),
    },

    {
      title: 'Catalog',
      path: '/catalog',
      icon: icon('ic-analytics'),
    },    
    ],
  }, 
{
    title: 'Report',
    path: '/report',
    icon: icon('ic-analytics'),

  children: [
    {
      title: 'Daily Attendance Report',
      path: '/report/daily-attendance-report',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Employee Attendance Summary',
      path: '/report/employee-attendance-summary',
      icon: icon('ic-analytics'),
    },    
    {
      title: 'Employee Visit Report',
      path: '/report/employee-visit-report',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Daily Order Summary',
      path: '/report/daily-order-summary',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Monthly Performance Report',
      path: '/report/monthly-performance-report',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Market Map',
      path: '/report/geofence-map',
      icon: icon('ic-analytics'),
    },
    {
      title: 'Live Location',
      path: '/employee-live-location',
      icon: icon('ic-analytics'),
    },    
    {
      title: 'Employee Location History',
      path: '/employee-location',
      icon: icon('ic-analytics'),
    },
     
    ],
  },   
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
