import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { EmployeeHierarchyAssignment } from '../../../../redux/service/employeeHierarchyAssignmentSlice';
import { useUpdateEmployeeHierarchyAssignmentStatusMutation } from '../../../../redux/service/employeeHierarchyAssignmentSlice';

export type UserProps = EmployeeHierarchyAssignment;

const assignmentStatuses: { value: 0 | 1; label: string }[] = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' },
];

function statusColor(status: string): 'success' | 'warning' | 'default' {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'warning';   
    default:
      return 'default';
  }
}

type UserTableRowProps = {
  row: EmployeeHierarchyAssignment;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [updateAssignmentStatus, { isLoading }] = useUpdateEmployeeHierarchyAssignmentStatusMutation();
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

  const [currentStatus, setCurrentStatus] = useState(row.is_current);
  
  const handleStatusChange = async (isCurrent: boolean) => {
      const previousStatus = currentStatus;
      setCurrentStatus(isCurrent);
      try {
        await updateAssignmentStatus({
          id: row.id,
          user_id: row.user_id as number,
          is_current: isCurrent ? '1' : '0',
        }).unwrap();
        toast.success('Assignment status updated');
      } catch (error: any) {
        setCurrentStatus(previousStatus);
        toast.error(error?.data?.message || 'Failed to update assignment status');
      }
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
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={currentStatus ? '1' : '0'}
            onChange={(event) => handleStatusChange(event.target.value === '1')}
            disabled={isLoading}
            renderValue={(value) => {
              const label = value === '1' ? 'Active' : 'Inactive';
              return <Chip size="small" label={label} color={statusColor(label)} />;
            }}
            inputProps={{ 'aria-label': `Update status for ${row.user ?? 'assignment'}` }}
          >
            {assignmentStatuses.map(({ value, label }) => (
              <MenuItem key={String(value)} value={String(value)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
