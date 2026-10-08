import { useEffect, useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useDeleteGeofenceMutation } from '../../../redux/service/geofenchSlice';
import { toast } from 'react-toastify';
import { reverseGeocode } from './reverse-geocode';

export type UserProps = {
  id: number;
  firm_name: string;
  area_id: number;
  latitude: number | string;
  longitude: number | string;
  radius: number;
  user?: { id: number; name: string; employee_id: number; employee?: { id: number; name: string; employee_id: string } };
};

type UserTableRowProps = { row: UserProps; selected: boolean; onSelectRow: () => void };

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [address, setAddress] = useState('Loading address...');
  const router = useRouter();
  const [deleteGeofence] = useDeleteGeofenceMutation();
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);

  useEffect(() => {
    let mounted = true;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setAddress('Address unavailable');
      return () => { mounted = false; };
    }
    setAddress('Loading address...');
    reverseGeocode(latitude, longitude)
      .then((value) => { if (mounted) setAddress(value); })
      .catch(() => { if (mounted) setAddress('Address unavailable'); });
    return () => { mounted = false; };
  }, [latitude, longitude]);

  const handleClosePopover = useCallback(() => setOpenPopover(null), []);
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this geofence?')) return;
    try {
      await deleteGeofence(row.id).unwrap();
      toast.success('Geofence deleted successfully');
    } catch {
      toast.error('Failed to delete geofence');
    }
    handleClosePopover();
  };

  return <>
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox"><Checkbox checked={selected} onChange={onSelectRow} /></TableCell>
      <TableCell>{row.firm_name}</TableCell>
      <TableCell sx={{ minWidth: 280, maxWidth: 520, whiteSpace: 'normal' }}>{address}</TableCell>
      <TableCell>{row.radius}</TableCell>
      <TableCell align="right"><IconButton onClick={(event) => setOpenPopover(event.currentTarget)}><Iconify icon="eva:more-vertical-fill" /></IconButton></TableCell>
    </TableRow>
    <Popover open={Boolean(openPopover)} anchorEl={openPopover} onClose={handleClosePopover} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuList disablePadding sx={{ p: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 } }}>
        <MenuItem onClick={() => router.push(`edit-geofench/${row.id}`)}><Iconify icon="solar:pen-bold" />Edit</MenuItem>
      </MenuList>
    </Popover>
  </>;
}

