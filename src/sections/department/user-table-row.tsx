import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useDeleteDepartmentMutation, type Department } from '../../../redux/service/departmentsSlice';
import { toast } from 'react-toastify';

type DepartmentTableRowProps = { row: Department; selected: boolean; onSelectRow: () => void };

export function UserTableRow({ row }: DepartmentTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const closePopover = useCallback(() => setOpenPopover(null), []);

  const handleDelete = async () => {
    if (!window.confirm(`Delete department "${row.name}"?`)) return;
    try {
      await deleteDepartment(row.id).unwrap();
      toast.success('Department deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete department');
    }
    closePopover();
  };

  return (
    <>
      <TableRow hover>
        <TableCell />
        <TableCell component="th" scope="row">{row.name}</TableCell>
        <TableCell>{row.company?.company_name || `Company #${row.company_id}`}</TableCell>
        <TableCell>{row.description || '—'}</TableCell>
        <TableCell><Label color={row.status.toLowerCase() === 'active' ? 'success' : 'error'}>{row.status}</Label></TableCell>
        <TableCell align="right"><IconButton onClick={(event) => setOpenPopover(event.currentTarget)}><Iconify icon="eva:more-vertical-fill" /></IconButton></TableCell>
      </TableRow>
      <Popover open={!!openPopover} anchorEl={openPopover} onClose={closePopover} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuList disablePadding sx={{ p: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 } }}>
          <MenuItem onClick={() => router.push(`/department/edit-department/${row.id}`)}><Iconify icon="solar:pen-bold" />Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Iconify icon="solar:trash-bin-trash-bold" />Delete</MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
