import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Label } from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import type { Geofence } from '../../../redux/service/geofenchSlice';

export type UserProps = Geofence & {
  hierarchy_node?: string | { id: number; name: string } | null;
};

type UserTableRowProps = { row: UserProps; selected: boolean; onSelectRow: () => void };

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();
  const handleClosePopover = useCallback(() => setOpenPopover(null), []);

  const hierarchyNode = typeof row.hierarchy_node === 'string'
    ? row.hierarchy_node
    : row.hierarchy_node?.name ?? row.hierarchy_node_id ?? '-';

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox"><Checkbox checked={selected} onChange={onSelectRow} /></TableCell>
        <TableCell>{row.firm_name}</TableCell>
        <TableCell sx={{ minWidth: 220, maxWidth: 420, whiteSpace: 'normal' }}>{row.address || '-'}</TableCell>
        <TableCell>{hierarchyNode}</TableCell>
        <TableCell>{row.radius}</TableCell>
        <TableCell>
          {row.visit_status ? (
            <Label color={row.visit_status === 'visited' ? 'success' : 'warning'}>
              {row.visit_status.replaceAll('_', ' ')}
            </Label>
          ) : '-'}
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label={`Actions for ${row.firm_name}`} onClick={(event) => setOpenPopover(event.currentTarget)}>
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
        <MenuList disablePadding sx={{ p: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 } }}>
          <MenuItem onClick={() => { handleClosePopover(); router.push(`edit-geofench/${row.id}`); }}>
            <Iconify icon="solar:pen-bold" />Edit
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
