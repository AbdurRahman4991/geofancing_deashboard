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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useDeleteEmployeeMutation, useUpdateEmployeeMutation } from '../../../redux/service/employeeSlice';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: number;
  name: string;
  employee_id: string;
  phone: string;
  company_id?: string;
  nature_of_employment: string;
  department?: string;
  unit?: string;
  date_of_joining: string;
  division?: string;
  designation?: string;
  reporting_person?: string;
  email?: string;
  dob?: string;
  section_info?: string;
  status: string;
  registration_status?: string;
};




type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
   const router = useRouter();
   const [deleteUser] = useDeleteEmployeeMutation();
  const [currentStatus, setCurrentStatus] = useState(row.status.toLowerCase());
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

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
      await updateEmployee({
        id: row.id,
        data: { status },
      }).unwrap();
      toast.success('Employee status updated');
    } catch (error: any) {
      setCurrentStatus(previousStatus);
      toast.error(error?.data?.message || 'Failed to update employee status');
    }
  };

      const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this company?")) return;
  
      try {
        await deleteUser(row.id).unwrap();
        toast.success("Company deleted successfully");
      } catch (err) {
        toast.error("Failed to delete company");
      }
  
      handleClosePopover();
    };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
         <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell component="th" scope="row">
  {row.name}
</TableCell>

<TableCell>{row.employee_id}</TableCell>
<TableCell>{row.phone}</TableCell>
<TableCell>{row.company_id}</TableCell>
<TableCell>{row.nature_of_employment}</TableCell>
<TableCell>{row.department}</TableCell>
<TableCell>{row.unit}</TableCell>
<TableCell>{row.date_of_joining}</TableCell>
<TableCell>{row.designation}</TableCell>
<TableCell>{row.email}</TableCell>

<TableCell>
  <FormControl size="small" sx={{ minWidth: 125 }}>
    <Select
      value={currentStatus}
      onChange={(event) => handleStatusChange(event.target.value as 'active' | 'inactive')}
      disabled={isLoading}
      renderValue={(value) => (
        <Chip
          size="small"
          label={value === 'active' ? 'Active' : 'Inactive'}
          color={value === 'active' ? 'success' : 'warning'}
        />
      )}
      inputProps={{ 'aria-label': `Update status for ${row.name}` }}
    >
      <MenuItem value="active">Active</MenuItem>
      <MenuItem value="inactive">Inactive</MenuItem>
    </Select>
  </FormControl>
</TableCell>
<TableCell>
  {row.registration_status ? (
    <Label color={row.registration_status === 'registered' ? 'success' : 'warning'}>
      {row.registration_status.replaceAll('_', ' ')}
    </Label>
  ) : (
    '—'
  )}
</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
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
          <MenuItem  onClick={() => router.push(`/employee/edit-employee/${row.id}`)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          {/* <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
