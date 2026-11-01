import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { Category } from '../../../../redux/service/categorySlice';

type UserTableRowProps = {
  row: Category;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();
  const isActive = row.status.toLowerCase() === 'active';

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    handleClosePopover();
    router.push(`/edit/edit-category/${row.id}`);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{row.name}</Typography>
        </TableCell>
        <TableCell>{row.description || '—'}</TableCell>
        <TableCell>
          {row.subcategories.length ? (
            <Typography variant="body2">
              {row.subcategories.map((subcategory) => subcategory.name).join(', ')}
            </Typography>
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell>
          <Chip size="small" label={row.status} color={isActive ? 'success' : 'default'} />
        </TableCell>
        <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}</TableCell>
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
