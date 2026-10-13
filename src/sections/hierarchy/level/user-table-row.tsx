import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { Level } from '../../../../redux/service/levelSlice';

type UserTableRowProps = {
  row: Level;
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
    router.push(`/hierarchy/edit-level/${row.id}`);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox"><Checkbox checked={selected} onChange={onSelectRow} /></TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.code ?? '—'}</TableCell>
        <TableCell>{row.level_order}</TableCell>
        <TableCell>{row.nodes_count ?? 0}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={row.is_active ? 'Active' : 'Inactive'}
            color={row.is_active ? 'success' : 'default'}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label={`Actions for ${row.name}`} onClick={handleOpenPopover}>
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



