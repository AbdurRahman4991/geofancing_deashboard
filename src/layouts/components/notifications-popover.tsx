// import type { IconButtonProps } from '@mui/material/IconButton';

// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import Badge from '@mui/material/Badge';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import Tooltip from '@mui/material/Tooltip';
// import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';

// import { fToNow } from 'src/utils/format-time';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// // ----------------------------------------------------------------------

// type NotificationItemProps = {
//   id: string;
//   type: string;
//   title: string;
//   isUnRead: boolean;
//   description: string;
//   avatarUrl: string | null;
//   postedAt: string | number | null;
// };

// export type NotificationsPopoverProps = IconButtonProps & {
//   data?: NotificationItemProps[];
// };

// export function NotificationsPopover({ data = [], sx, ...other }: NotificationsPopoverProps) {
//   const [notifications, setNotifications] = useState(data);

//   const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

//   const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

//   const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
//     setOpenPopover(event.currentTarget);
//   }, []);

//   const handleClosePopover = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//   const handleMarkAllAsRead = useCallback(() => {
//     const updatedNotifications = notifications.map((notification) => ({
//       ...notification,
//       isUnRead: false,
//     }));

//     setNotifications(updatedNotifications);
//   }, [notifications]);

//   return (
//     <>
//       <IconButton
//         color={openPopover ? 'primary' : 'default'}
//         onClick={handleOpenPopover}
//         sx={sx}
//         {...other}
//       >
//         <Badge badgeContent={totalUnRead} color="error">
//           <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
//         </Badge>
//       </IconButton>

//       <Popover
//         open={!!openPopover}
//         anchorEl={openPopover}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         slotProps={{
//           paper: {
//             sx: {
//               width: 360,
//               overflow: 'hidden',
//               display: 'flex',
//               flexDirection: 'column',
//             },
//           },
//         }}
//       >
//         <Box
//           sx={{
//             py: 2,
//             pl: 2.5,
//             pr: 1.5,
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="subtitle1">Notifications</Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               You have {totalUnRead} unread messages
//             </Typography>
//           </Box>

//           {totalUnRead > 0 && (
//             <Tooltip title=" Mark all as read">
//               <IconButton color="primary" onClick={handleMarkAllAsRead}>
//                 <Iconify icon="eva:done-all-fill" />
//               </IconButton>
//             </Tooltip>
//           )}
//         </Box>

//         <Divider sx={{ borderStyle: 'dashed' }} />

//         <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
//           <List
//             disablePadding
//             subheader={
//               <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
//                 New
//               </ListSubheader>
//             }
//           >
//             {notifications.slice(0, 2).map((notification) => (
//               <NotificationItem key={notification.id} notification={notification} />
//             ))}
//           </List>

//           <List
//             disablePadding
//             subheader={
//               <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
//                 Before that
//               </ListSubheader>
//             }
//           >
//             {notifications.slice(2, 5).map((notification) => (
//               <NotificationItem key={notification.id} notification={notification} />
//             ))}
//           </List>
//         </Scrollbar>

//         <Divider sx={{ borderStyle: 'dashed' }} />

//         <Box sx={{ p: 1 }}>
//           <Button fullWidth disableRipple color="inherit">
//             View all
//           </Button>
//         </Box>
//       </Popover>
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function NotificationItem({ notification }: { notification: NotificationItemProps }) {
//   const { avatarUrl, title } = renderContent(notification);

//   return (
//     <ListItemButton
//       sx={{
//         py: 1.5,
//         px: 2.5,
//         mt: '1px',
//         ...(notification.isUnRead && {
//           bgcolor: 'action.selected',
//         }),
//       }}
//     >
//       <ListItemAvatar>
//         <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
//       </ListItemAvatar>
//       <ListItemText
//         primary={title}
//         secondary={
//           <Typography
//             variant="caption"
//             sx={{
//               mt: 0.5,
//               gap: 0.5,
//               display: 'flex',
//               alignItems: 'center',
//               color: 'text.disabled',
//             }}
//           >
//             <Iconify width={14} icon="solar:clock-circle-outline" />
//             {fToNow(notification.postedAt)}
//           </Typography>
//         }
//       />
//     </ListItemButton>
//   );
// }

// // ----------------------------------------------------------------------

// function renderContent(notification: NotificationItemProps) {
//   const title = (
//     <Typography variant="subtitle2">
//       {notification.title}
//       <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//         &nbsp; {notification.description}
//       </Typography>
//     </Typography>
//   );

//   if (notification.type === 'order-placed') {
//     return {
//       avatarUrl: (
//         <img
//           alt={notification.title}
//           src="/assets/icons/notification/ic-notification-package.svg"
//         />
//       ),
//       title,
//     };
//   }
//   if (notification.type === 'order-shipped') {
//     return {
//       avatarUrl: (
//         <img
//           alt={notification.title}
//           src="/assets/icons/notification/ic-notification-shipping.svg"
//         />
//       ),
//       title,
//     };
//   }
//   if (notification.type === 'mail') {
//     return {
//       avatarUrl: (
//         <img alt={notification.title} src="/assets/icons/notification/ic-notification-mail.svg" />
//       ),
//       title,
//     };
//   }
//   if (notification.type === 'chat-message') {
//     return {
//       avatarUrl: (
//         <img alt={notification.title} src="/assets/icons/notification/ic-notification-chat.svg" />
//       ),
//       title,
//     };
//   }
//   return {
//     avatarUrl: notification.avatarUrl ? (
//       <img alt={notification.title} src={notification.avatarUrl} />
//     ) : null,
//     title,
//   };
// }

import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '../../../redux/service/notificationSlice';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export type NotificationsPopoverProps = IconButtonProps;


export function NotificationsPopover({
  sx,
  ...other
}: NotificationsPopoverProps) {

  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const navigate = useNavigate();

  // GET NOTIFICATIONS
  const {
    data: notificationResponse,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery({
    page: 1,
    per_page: 20,
  });

  // MARK SINGLE AS READ
  const [markAsRead, { isLoading: isMarking }] =
    useMarkNotificationAsReadMutation();

  // MARK ALL AS READ
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  // API DATA
  const notifications = notificationResponse?.data?.data ?? [];

  // UNREAD COUNT
  const totalUnRead = notificationResponse?.unread_count ?? 0;

  // MAXIMUM 4 NOTIFICATIONS
  const newNotifications = notifications
    .filter((notification) => !notification.read_at)
    .slice(0, 4);

  const previousNotifications = notifications
    .filter((notification) => notification.read_at)
    .slice(0, Math.max(0, 4 - newNotifications.length));

  // VIEW ALL
  const handleViewAll = useCallback(() => {
    setOpenPopover(null);
    navigate('/notification');
  }, [navigate]);

  // OPEN POPOVER
  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  // CLOSE POPOVER
  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // MARK ALL AS READ
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error(error);
    }
  }, [markAllAsRead]);

  // MARK SINGLE AS READ
  const handleNotificationClick = useCallback(
    async (id: string, isUnread: boolean) => {
      if (!isUnread) return;

      try {
        await markAsRead(id).unwrap();
      } catch (error) {
        console.error(error);
      }
    },
    [markAsRead]
  );

  // Keep your existing return JSX below...


  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify
            width={24}
            icon="solar:bell-bing-bold-duotone"
          />
        </Badge>
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
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >

        {/* HEADER */}
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              Notifications
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                >
                  <Iconify icon="eva:done-all-fill" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* NOTIFICATION LIST */}
      
{/* NOTIFICATION LIST */}
<Scrollbar
  fillContent
  sx={{
    minHeight: 240,
    maxHeight: { xs: 360, sm: 'none' },
  }}
>
  {isLoading && (
    <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={28} />
    </Box>
  )}

  {isError && (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography color="error">
        Failed to load notifications.
      </Typography>
      <Button onClick={() => refetch()}>Retry</Button>
    </Box>
  )}

  {!isLoading && !isError && notifications.length === 0 && (
    <Box sx={{ py: 5, textAlign: 'center' }}>
      <Typography color="text.secondary">
        No notifications found
      </Typography>
    </Box>
  )}

  {!isLoading && !isError && notifications.length > 0 && (
    
<>
  {/* NEW */}
  <List
    disablePadding
    subheader={
      <ListSubheader
        disableSticky
        sx={{ py: 1, px: 2.5, typography: 'overline' }}
      >
        New
      </ListSubheader>
    }
  >
    {newNotifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onClick={handleNotificationClick}
        isMarking={isMarking}
      />
    ))}
  </List>

  {/* BEFORE THAT */}
  {previousNotifications.length > 0 && (
    <List
      disablePadding
      subheader={
        <ListSubheader
          disableSticky
          sx={{ py: 1, px: 2.5, typography: 'overline' }}
        >
          Before that
        </ListSubheader>
      }
    >
      {previousNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={handleNotificationClick}
          isMarking={isMarking}
        />
      ))}
    </List>
  )}
</>

  )}
</Scrollbar>


        <Divider sx={{ borderStyle: 'dashed' }} />        

        {/* FOOTER */}
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            color="inherit"
            onClick={handleViewAll}
          >
            View all
          </Button>
        </Box>

      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------
// NOTIFICATION ITEM
// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  onClick,
  isMarking,
}: {
  notification: any;
  onClick: (id: string, isUnread: boolean) => void;
  isMarking: boolean;
}) {

  const isUnread = !notification.read_at;

  const { avatar } = renderNotificationIcon(
    notification.data?.type
  );

  return (
    <ListItemButton
      onClick={() => onClick(notification.id, isUnread)}
      disabled={isMarking && isUnread}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(isUnread && {
          bgcolor: 'action.selected',
        }),
      }}
    >

      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: 'background.neutral',
            width: 40,
            height: 40,
          }}
        >
          {avatar}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {notification.data?.title}
          </Typography>
        }
        secondary={
          <>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
              }}
            >
              {notification.data?.message}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify
                width={14}
                icon="solar:clock-circle-outline"
              />

              {fToNow(notification.created_at)}
            </Typography>
          </>
        }
      />

      {isUnread && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'error.main',
            ml: 1,
            flexShrink: 0,
          }}
        />
      )}

    </ListItemButton>
  );
}

// ----------------------------------------------------------------------
// NOTIFICATION ICON
// ----------------------------------------------------------------------

function renderNotificationIcon(type: string) {

  switch (type) {

    case 'hierarchy_assignment':
      return {
        avatar: (
          <Iconify
            icon="solar:users-group-rounded-bold-duotone"
            width={24}
            color="primary.main"
          />
        ),
      };

    case 'order-placed':
      return {
        avatar: (
          <Iconify icon="solar:box-bold-duotone" width={24} />
        ),
      };

    case 'order-shipped':
      return {
        avatar: (
          <Iconify icon="solar:delivery-bold-duotone" width={24} />
        ),
      };

    case 'mail':
      return {
        avatar: (
          <Iconify icon="solar:letter-bold-duotone" width={24} />
        ),
      };

    case 'chat-message':
      return {
        avatar: (
          <Iconify icon="solar:chat-round-dots-bold-duotone" width={24} />
        ),
      };

    default:
      return {
        avatar: (
          <Iconify icon="solar:bell-bold-duotone" width={24} />
        ),
      };
  }
}
