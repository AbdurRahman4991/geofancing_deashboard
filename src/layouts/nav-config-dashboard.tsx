import { patch } from '@mui/material';
//import { title } from 'process';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Employee',
    path: '/user',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'Company',
  //   path: '/company',
  //   icon: icon('ic-user'),
  // },
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
