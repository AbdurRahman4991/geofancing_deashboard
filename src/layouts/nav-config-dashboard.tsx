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
  
  {
    title: 'Employee',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Company',
    path: '/company',
    icon: icon('ic-user'),
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
        title: 'Country',
        path: '/hierarchy/country',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Region',
        path: '/hierarchy/region',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Zone',
        path: '/hierarchy/zone',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Division',
        path: '/hierarchy/division',
        icon: icon('ic-analytics'),
      },
      {
        title: 'District',
        path: '/hierarchy/district',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Sub District',
        path: '/hierarchy/sub-district',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Territory',
        path: '/hierarchy/territory',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Area',
        path: '/hierarchy/area',
        icon: icon('ic-analytics'),
      },
      {
        title: 'Farm',
        path: '/hierarchy/farm',
        icon: icon('ic-analytics'),
      },
    ],
  },

  {
    title: 'Geofench',
    path: '/geofench',
    icon: icon('ic-cart'),

  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: icon('ic-cart'),

  },
  {
    title: 'Attendance Role',
    path: '/attendance-role',
    icon: icon('ic-cart'),

  },
  {
    title: 'Employee Tracking',
    path: '/employee-location',
    icon: icon('ic-cart'),

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
