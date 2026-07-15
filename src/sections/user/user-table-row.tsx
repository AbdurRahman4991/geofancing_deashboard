import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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
import { useDeleteEmployeeMutation } from '../../../redux/service/employeeSlice';
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

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

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
  <Label color={row.status === "active" ? "success" : "error"}>
    {row.status}
  </Label>
</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <Popover
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
          <MenuItem  onClick={() => router.push(`edit-user/${row.id}`)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
