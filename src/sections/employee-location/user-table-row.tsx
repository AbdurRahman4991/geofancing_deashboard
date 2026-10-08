
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { reverseGeocode } from '../../utils/reverse-geocode';

//import { useDeleteGeofenceMutation } from '../../../redux/service/geofenchSlice';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

function formatDhakaLocalTime(timestamp: string): string {
  if (!timestamp) return '-';

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);
  const normalizedTimestamp = hasTimezone ? timestamp : `${timestamp.replace(' ', 'T')}Z`;
  const date = new Date(normalizedTimestamp);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  }).format(date);
}
export type UserProps = {
  id: number;
  employee_id: number;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;

  employee?: {
    id: number;
    name: string;
    employee_id: string;
  };
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const router = useRouter();
  const [address, setAddress] = useState('Loading address...');
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
  //const [deleteGeofence] = useDeleteGeofenceMutation();

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this geofence?')) return;

    // try {
    //   await deleteGeofence(row.id).unwrap();
    //   toast.success('Geofence deleted successfully');
    // } catch (error) {
    //   toast.error('Failed to delete geofence');
    // }

    handleClosePopover();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

          <TableCell>{row.employee?.name ?? '-'}</TableCell>

          <TableCell>{row.employee?.employee_id ?? '-'}</TableCell>

          <TableCell sx={{ minWidth: 280, maxWidth: 520, whiteSpace: "normal" }}>{address}</TableCell>

          <TableCell>
            {formatDhakaLocalTime(row.created_at)}
          </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
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
          <MenuItem
              onClick={() => router.push(`/employee-location/${row.id}`)}
          >
              <Iconify icon="solar:eye-bold" />
              View
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${row.latitude},${row.longitude}`,
                "_blank"
              );
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem> */}
           {/* <MenuItem onClick={() => router.push(`edit-geofench/${row.id}`)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}





