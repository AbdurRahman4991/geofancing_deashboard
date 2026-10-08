import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useLogoutMutation } from '../../../redux/api/authApi';

type LoggedInUser = {
  name?: string;
  display_name?: string;
  displayName?: string;
  email?: string;
  avatar_url?: string;
  photo_url?: string;
  employee?: { name?: string };
};

function readLoggedInUser(): LoggedInUser {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}') as LoggedInUser;
  } catch {
    return {};
  }
}

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({
  data = [],
  sx,
  ...other
}: AccountPopoverProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState(readLoggedInUser);
  const displayName = user.name || user.display_name || user.displayName || user.employee?.name || user.email?.split('@')[0] || 'Account';
  const email = user.email || '';
  const photoURL = user.avatar_url || user.photo_url || '/assets/images/avatar/avatar-25.webp';

  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const [logout, { isLoading }] = useLogoutMutation();

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Close popover
      handleClosePopover();

      // Go to login page
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);

      // Optional:
      // Backend logout fail à¦¹à¦²à§‡à¦“ local session clear à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦‡à¦²à§‡
      // à¦¨à¦¿à¦šà§‡à¦° code à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤

      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      handleClosePopover();
      router.push('/sign-in');
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={photoURL}
          alt={displayName}
          sx={{ width: 1, height: 1 }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
            noWrap
          >
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',

              '&:hover': {
                color: 'text.primary',
              },

              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}


