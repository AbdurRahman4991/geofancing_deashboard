import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, {
  menuItemClasses,
} from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { toast } from 'react-toastify';

// Change this to your attendance rule delete API
// import {
//   useDeleteAttendanceRuleMutation,
// } from '../../../redux/service/attendanceRuleSlice';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type UserProps = {
  id: number;

  user_id: number | null;

  company_id: number;

  office_in_time: string;

  office_out_time: string;

  weekend_holidays: string;

  government_holidays: string;

  is_active: boolean;
  tracking_enabled: boolean;

  created_at: string;

  updated_at: string;

  company?: {
    id: number;
    company_name: string;
    avatar_url?: string;
    media?: unknown[];
  } | null;

  user?: {
    name?: string;
    employee?: { name?: string; employee_id?: string } | null;
  } | null;
};

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: UserProps;

  selected: boolean;

  onSelectRow: () => void;
};

// ----------------------------------------------------------------------

export function UserTableRow({
  row,
  selected,
  onSelectRow,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const router = useRouter();

  // const [deleteAttendanceRule] =
  //   useDeleteAttendanceRuleMutation();

  // ============================================================
  // OPEN MENU
  // ============================================================

  const handleOpenPopover = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  // ============================================================
  // CLOSE MENU
  // ============================================================

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this attendance role?'
      )
    ) {
      return;
    }

    // try {
    //   await deleteAttendanceRule(row.id).unwrap();

    //   toast.success(
    //     'Attendance role deleted successfully'
    //   );
    // } catch (err) {
    //   toast.error(
    //     'Failed to delete attendance role'
    //   );
    // }

    handleClosePopover();
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = () => {
    router.push(
      `/edit/attendance-role/${row.id}`
    );

    handleClosePopover();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        {/* ======================================================
            CHECKBOX
        ====================================================== */}

        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={onSelectRow}
          />
        </TableCell>

        {/* ======================================================
            COMPANY
        ====================================================== */}

        <TableCell
          component="th"
          scope="row"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {row.company?.company_name ?? '-'}
          </Box>
        </TableCell>

        <TableCell>
          {row.user?.name ?? row.user?.employee?.name ?? 'Company-wide'}
        </TableCell>

        {/* ======================================================
            OFFICE IN TIME
        ====================================================== */}

        <TableCell>
          {row.office_in_time ?? '-'}
        </TableCell>

        {/* ======================================================
            OFFICE OUT TIME
        ====================================================== */}

        <TableCell>
          {row.office_out_time ?? '-'}
        </TableCell>

        {/* ======================================================
            WEEKEND HOLIDAYS
        ====================================================== */}

        <TableCell>
          {row.weekend_holidays ?? '-'}
        </TableCell>

        {/* ======================================================
            GOVERNMENT HOLIDAYS
        ====================================================== */}

        <TableCell>
          {row.government_holidays ?? '-'}
        </TableCell>

        <TableCell>
          <Label color={row.tracking_enabled ? 'success' : 'default'}>
            {row.tracking_enabled ? 'Enabled' : 'Disabled'}
          </Label>
        </TableCell>

        {/* ======================================================
            STATUS
        ====================================================== */}

        <TableCell>
          <Label
            color={
              row.is_active
                ? 'success'
                : 'error'
            }
          >
            {row.is_active
              ? 'Active'
              : 'Inactive'}
          </Label>
        </TableCell>

        {/* ======================================================
            ACTION
        ====================================================== */}

        <TableCell align="right">
          <IconButton
            onClick={handleOpenPopover}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* ========================================================
          ACTION POPOVER
      ======================================================== */}

      <Popover
        open={!!openPopover}
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
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',

            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,

              [`&.${menuItemClasses.selected}`]: {
                bgcolor:
                  'action.selected',
              },
            },
          }}
        >
          {/* EDIT */}

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          {/* DELETE */}

          {/* <MenuItem
            onClick={handleDelete}
            sx={{
              color: 'error.main',
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />

            Delete
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
