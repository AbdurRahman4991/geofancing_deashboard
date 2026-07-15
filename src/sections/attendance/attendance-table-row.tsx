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
import { format } from "date-fns";

// ----------------------------------------------------------------------

export type UserProps = {
  id: number;
  check_in_time?: string;
  check_out_time?: string;
  work_hour?: string;
  late?: string;
  status: string;
  distance_from_office?: number;
  remarks?: string;
};




type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};
export function AttendanceTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();
  const [deleteUser] = useDeleteEmployeeMutation();

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
            {row.check_in_time
              ? format(new Date(row.check_in_time), "dd-MM-yyyy HH:mm:ss")
              : "-"}
          </TableCell>

          <TableCell>
            {row.check_out_time
              ? format(new Date(row.check_out_time), "dd-MM-yyyy HH:mm:ss")
              : "-"}
          </TableCell>

        {/* <TableCell>{row.check_in_time ?? "-"}</TableCell>
        <TableCell>{row.check_out_time ?? "-"}</TableCell> */}
        {/* <TableCell>{row.work_hour ?? "-"}</TableCell>
        <TableCell>{row.late ? "Yes" : "No"}</TableCell> */}

        <TableCell>
          <Label
            color={
              row.status === "Checked In"
                ? "success"
                : row.status === "Checked Out"
                ? "info"
                : "warning"
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          {row.distance_from_office ? `${row.distance_from_office} m` : "-"}
        </TableCell>

        <TableCell>{row.remarks ?? "-"}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList sx={{ p: 0.5, width: 140 }}>
          <MenuItem onClick={() => router.push(`edit-user/${row.id}`)}>   
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
