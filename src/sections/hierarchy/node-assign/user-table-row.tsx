import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { EmployeeHierarchyAssignment } from '../../../../redux/service/employeeHierarchyAssignmentSlice';

export type UserProps = EmployeeHierarchyAssignment;

type UserTableRowProps = {
  row: EmployeeHierarchyAssignment;
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

  const handleEdit = () => {
    handleClosePopover();
    router.push('/edit/assign-node/' + row.id);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.user ?? '—'}</TableCell>
        <TableCell>{row.company_id ?? '—'}</TableCell>
        <TableCell>{row.company ?? '—'}</TableCell>
        <TableCell>{row.hierarchy_node_id ?? '—'}</TableCell>
        <TableCell>{row.hierarchy_node ?? '—'}</TableCell>
        <TableCell>{row.hierarchy_level ?? '—'}</TableCell>
        <TableCell>{row.hierarchy_level_code ?? '—'}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={row.is_current ? 'Current' : 'Previous'}
            color={row.is_current ? 'success' : 'default'}
          />
        </TableCell>
        <TableCell>{row.assigned_by ?? '—'}</TableCell>
        <TableCell align="right">
          <IconButton aria-label={'Actions for ' + (row.user ?? 'assignment')} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            '& .MuiMenuItem-root': {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
