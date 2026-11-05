import { useState, useCallback, useEffect } from 'react';

import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { UserRecord } from '../../../redux/service/userSlice';
import { useUpdateUserMutation } from '../../../redux/service/userSlice';
import { toast } from 'react-toastify';

type UserTableRowProps = {
  row: UserRecord;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [currentStatus, setCurrentStatus] = useState(row.status.toLowerCase());
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const router = useRouter();

  useEffect(() => {
    setCurrentStatus(row.status.toLowerCase());
  }, [row.status]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleStatusChange = async (status: 'active' | 'inactive') => {
    const previousStatus = currentStatus;
    setCurrentStatus(status);
    try {
      await updateUser({ id: row.id, data: { email: row.email, status } }).unwrap();
      toast.success('User status updated');
    } catch (error: any) {
      setCurrentStatus(previousStatus);
      toast.error(error?.data?.message || 'Failed to update user status');
    }
  };

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
          <FormControl size="small" sx={{ minWidth: 125 }}>
            <Select
              value={currentStatus}
              onChange={(event) => handleStatusChange(event.target.value as 'active' | 'inactive')}
              disabled={isLoading}
              renderValue={(value) => (
                <Chip size="small" label={value === 'active' ? 'Active' : 'Inactive'} color={value === 'active' ? 'success' : 'warning'} />
              )}
              inputProps={{ 'aria-label': `Update status for ${displayName}` }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
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
