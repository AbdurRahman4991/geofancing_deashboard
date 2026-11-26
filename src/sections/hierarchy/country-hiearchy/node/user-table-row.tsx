import { useCallback, useState } from 'react';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useDeleteCountryHiearchyNodeMutation, type CountryHiearchyNode } from '../../../../../redux/service/countryHiearchyNodeService';

export type UserProps = CountryHiearchyNode;

type UserTableRowProps = {
  row: CountryHiearchyNode;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [deleteNode, { isLoading: isDeleting }] = useDeleteCountryHiearchyNodeMutation();
  const router = useRouter();
  const closePopover = useCallback(() => setOpenPopover(null), []);
  const openMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setOpenPopover(event.currentTarget), []);

  const handleEdit = () => {
    closePopover();
    router.push(`/edit/country-hiearchy-node/${row.id}?company_id=${row.company_id}`);
  };

  const handleDelete = async () => {
    closePopover();
    if (!window.confirm(`Delete country hierarchy node "${row.name}"?`)) return;
    try {
      await deleteNode({ company_id: row.company_id, id: row.id }).unwrap();
      toast.success('Country hierarchy node deleted.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete country hierarchy node.');
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox"><Checkbox checked={selected} onChange={onSelectRow} /></TableCell>
        <TableCell><Typography variant="subtitle2">{row.name}</Typography></TableCell>
        <TableCell>{row.code || '—'}</TableCell>
        <TableCell>{row.level?.name ?? `Level #${row.hierarchy_level_id}`}</TableCell>
        <TableCell>{row.parent?.name ?? 'Root'}</TableCell>
        <TableCell><Chip size="small" label={row.status} color={row.status === 'active' ? 'success' : 'default'} /></TableCell>
        <TableCell>{row.latitude ?? '—'}{row.longitude !== null ? `, ${row.longitude}` : ''}</TableCell>
        <TableCell align="right">
          <IconButton aria-label={`Actions for ${row.name}`} onClick={openMenu}><Iconify icon="eva:more-vertical-fill" /></IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList disablePadding sx={{ p: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 } }}>
          <MenuItem onClick={handleEdit}><Iconify icon="solar:pen-bold" />Edit</MenuItem>
          <MenuItem onClick={handleDelete} disabled={isDeleting}><Iconify icon="solar:trash-bin-trash-bold" />Delete</MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
