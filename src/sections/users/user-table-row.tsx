import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import type { UserRecord } from '../../../redux/service/userSlice';

type UserTableRowProps = {
  row: UserRecord;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const displayName = row.employee?.name || row.name || '—';

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell component="th" scope="row">{displayName}</TableCell>
        <TableCell>{row.employee?.employee_id || '—'}</TableCell>
        <TableCell>{row.email || '—'}</TableCell>
        <TableCell>{row.phone || '—'}</TableCell>
        <TableCell>{row.employee?.designation || '—'}</TableCell>
        <TableCell>{row.employee?.company_id ?? row.company_id ?? '—'}</TableCell>
        <TableCell>
          <Label color={row.status === 'active' ? 'success' : 'error'}>
            {row.status || '—'}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover} aria-label={`Actions for ${displayName}`}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={() => router.push(`/users/edit-user/${row.id}`)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}