
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

type DistrictProps = {
  id: number;
  division_id: number;
  name: string;
  status: number;

  division?: {
    id: number;
    zone_id: number;
    name: string;
    status: number;
    created_at?: string;
    updated_at?: string;
  };
};

type UserTableRowProps = {
  row: DistrictProps;
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
      setOpenPopover(
        event.currentTarget
      );
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
      `/hierarchy/edit-district/${row.id}`
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

        {/* District Name */}
        <TableCell>
          {row.name}
        </TableCell>

        {/* Division */}
        <TableCell>
          {row.division?.name || '-'}
        </TableCell>

        {/* Status */}
        <TableCell>
          {row.status === 1
            ? 'Active'
            : 'Inactive'}
        </TableCell>

        {/* Action */}
        <TableCell align="right">
          <IconButton
            onClick={handleOpenPopover}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

      </TableRow>

      {/* ---------------------------------------------------------------- */}
      {/* Popover */}
      {/* ---------------------------------------------------------------- */}

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
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

