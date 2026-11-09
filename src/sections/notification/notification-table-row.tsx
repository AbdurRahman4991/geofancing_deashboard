
import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { fToNow } from 'src/utils/format-time';

import type { Notification } from '../../../redux/service/notificationSlice';

// ----------------------------------------------------------------------

type NotificationTableRowProps = {
  row: Notification;
  selected: boolean;
  onSelectRow: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationTableRow({
  row,
  selected,
  onSelectRow,
  onMarkAsRead,
  onDelete,
}: NotificationTableRowProps) {

  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const isUnread = !row.read_at;

  const notification = row.data;

  const hierarchyNode =
    notification.hierarchy_node_name ?? 'Unassigned';

  return (
    <>
      <TableRow hover selected={selected}>

        {/* CHECKBOX */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={onSelectRow}
          />
        </TableCell>

        {/* TITLE */}
        <TableCell sx={{ minWidth: 200 }}>
          {notification.title}
        </TableCell>

        {/* MESSAGE */}
        <TableCell sx={{ minWidth: 260, maxWidth: 400, whiteSpace: 'normal' }}>
          {notification.message}
        </TableCell>

        {/* EMPLOYEE */}
        <TableCell sx={{ minWidth: 160 }}>
          {notification.employee_name || '-'}
        </TableCell>

        {/* HIERARCHY */}
        <TableCell>
          {hierarchyNode}
        </TableCell>

        {/* TYPE */}
        <TableCell>
          <Label color="info">
            {notification.type.replaceAll('_', ' ')}
          </Label>
        </TableCell>

        {/* STATUS */}
        <TableCell>
          <Label color={isUnread ? 'warning' : 'success'}>
            {isUnread ? 'Unread' : 'Read'}
          </Label>
        </TableCell>

        {/* CREATED AT */}
        <TableCell sx={{ minWidth: 140 }}>
          {fToNow(row.created_at)}
        </TableCell>

        {/* ACTION */}
        <TableCell align="right">
          <IconButton
            onClick={(event) => setOpenPopover(event.currentTarget)}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

      </TableRow>

      {/* ACTION POPOVER */}
      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            width: 170,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 1.5,
              borderRadius: 0.75,
            },
          }}
        >

          {/* MARK AS READ */}
          {isUnread && (
            <MenuItem
              onClick={() => {
                handleClosePopover();
                onMarkAsRead(row.id);
              }}
            >
              <Iconify icon="eva:checkmark-circle-2-fill" />
              Mark as read
            </MenuItem>
          )}

          {/* DELETE */}
          {/* <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete(row.id);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}

        </MenuList>
      </Popover>
    </>
  );
}
