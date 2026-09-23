import { useState, useCallback } from 'react';

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
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type EmployeeHierarchyAssignmentRow = {
  id: number;

  user: string | null;

  country: string | null;
  region: string | null;
  zone: string | null;
  division: string | null;
  district: string | null;
  sub_district: string | null;
  territory: string | null;
  area: string | null;

  effective_from: string | null;
  effective_to: string | null;

  is_current: boolean;

  assigned_by: string | null;

  reason: string | null;
};

type UserTableRowProps = {
  row: EmployeeHierarchyAssignmentRow;
  selected: boolean;
  onSelectRow: () => void;
};

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export function UserTableRow({
  row,
  selected,
  onSelectRow,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const router = useRouter();

  // --------------------------------------------------------------------
  // Popover
  // --------------------------------------------------------------------

  const handleOpenPopover = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // --------------------------------------------------------------------
  // Edit
  // --------------------------------------------------------------------

  const handleEdit = () => {
    handleClosePopover();

    router.push(
      `/edit/assign-hierarchy/${row.id}`
    );
  };

  // --------------------------------------------------------------------
  // Date Format
  // --------------------------------------------------------------------

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------

  return (
    <>
      <TableRow
        hover
        selected={selected}
      >

        {/* Checkbox */}

        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={onSelectRow}
          />
        </TableCell>

        {/* User */}

        <TableCell>
          {row.user || '-'}
        </TableCell>

        {/* Country */}

        <TableCell>
          {row.country || '-'}
        </TableCell>

        {/* Region */}

        <TableCell>
          {row.region || '-'}
        </TableCell>

        {/* Zone */}

        <TableCell>
          {row.zone || '-'}
        </TableCell>

        {/* Division */}

        <TableCell>
          {row.division || '-'}
        </TableCell>

        {/* District */}

        <TableCell>
          {row.district || '-'}
        </TableCell>

        {/* Sub District */}

        <TableCell>
          {row.sub_district || '-'}
        </TableCell>

        {/* Territory */}

        <TableCell>
          {row.territory || '-'}
        </TableCell>

        {/* Area */}

        <TableCell>
          {row.area || '-'}
        </TableCell>

        {/* Effective From */}

        <TableCell>
          {formatDate(
            row.effective_from
          )}
        </TableCell>

        {/* Status */}

        <TableCell>
          {row.is_current ? (
            <span
              style={{
                color: 'green',
                fontWeight: 600,
              }}
            >
              Active
            </span>
          ) : (
            <span
              style={{
                color: 'red',
                fontWeight: 600,
              }}
            >
              Inactive
            </span>
          )}
        </TableCell>

        {/* Assigned By */}

        <TableCell>
          {row.assigned_by || '-'}
        </TableCell>

        {/* Reason */}

        <TableCell>
          {row.reason || '-'}
        </TableCell>

        {/* Action */}

        <TableCell align="right">
          <IconButton
            onClick={handleOpenPopover}
          >
            <Iconify
              icon="eva:more-vertical-fill"
            />
          </IconButton>
        </TableCell>

      </TableRow>

      {/* Popover */}

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
            width: 140,
            display: 'flex',
            flexDirection: 'column',

            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
            },
          }}
        >

          <MenuItem
            onClick={handleEdit}
          >
            <Iconify
              icon="solar:pen-bold"
            />

            Edit
          </MenuItem>

        </MenuList>
      </Popover>
    </>
  );
}

