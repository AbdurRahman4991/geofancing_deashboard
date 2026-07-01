// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
// import Popover from '@mui/material/Popover';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuList from '@mui/material/MenuList';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
// import { useRouter } from 'src/routes/hooks';

// import { Label } from 'src/components/label';
// import { Iconify } from 'src/components/iconify';
// import { useDeleteGeofenceMutation } from '../../../redux/service/geofenchSlice';
// import { toast } from 'react-toastify';

// // ----------------------------------------------------------------------

// export type GeofenceProps = {
//   id: number;

//   company_id: number;
//   user_id: number;

//   latitude: string;
//   longitude: string;
//   radius: string;

//   // Relationship Data
//   company?: {
//     id: number;
//     company_name: string;
//   };

//   user?: {
//     id: number;
//     name: string;
//   };
// };





// type UserTableRowProps = {
//   row: GeofenceProps;
//   selected: boolean;
//   onSelectRow: () => void;
// };

// export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
//   const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
//    const router = useRouter();
//    const [deleteUser] = useDeleteGeofenceMutation();

//   const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
//     setOpenPopover(event.currentTarget);
//   }, []);

//   const handleClosePopover = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//       const handleDelete = async () => {
//       if (!confirm("Are you sure you want to delete this company?")) return;
  
//       try {
//         await deleteUser(row.id).unwrap();
//         toast.success("Company deleted successfully");
//       } catch (err) {
//         toast.error("Failed to delete company");
//       }
  
//       handleClosePopover();
//     };

//   return (
//     <>
//       <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
//          <TableCell padding="checkbox">
//           <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
//         </TableCell>
// {/*
//         <TableCell component="th" scope="row">
//           <Box
//             sx={{
//               gap: 2,
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             <Avatar alt={row.name} src={row.avatarUrl} />
//             {row.name}
//           </Box>
//         </TableCell>

//         <TableCell>{row.company}</TableCell>

//         <TableCell>{row.role}</TableCell>

//         <TableCell align="center">
//           {row.isVerified ? (
//             <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
//           ) : (
//             '-'
//           )}
//         </TableCell>

//         <TableCell>
//           <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
//         </TableCell>

//         <TableCell align="right">
//           <IconButton onClick={handleOpenPopover}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell> */}
//           <TableCell>{row.company?.company_name}</TableCell>
//         <TableCell>{row.user?.name}</TableCell>
//         <TableCell>{row.latitude}</TableCell>
//         <TableCell>{row.longitude}</TableCell>
//         <TableCell>{row.radius}</TableCell>
// {/* 
// <TableCell>
//   <Label color={row.status === "active" ? "success" : "error"}>
//     {row.status}
//   </Label>
// </TableCell> */}
//         <TableCell align="right">
//           <IconButton onClick={handleOpenPopover}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell>

//       </TableRow>

//       <Popover
//         open={!!openPopover}
//         anchorEl={openPopover}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuList
//           disablePadding
//           sx={{
//             p: 0.5,
//             gap: 0.5,
//             width: 140,
//             display: 'flex',
//             flexDirection: 'column',
//             [`& .${menuItemClasses.root}`]: {
//               px: 1,
//               gap: 2,
//               borderRadius: 0.75,
//               [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
//             },
//           }}
//         >
//           {/* <MenuItem  onClick={() => router.push(`edit-geofench/${row.id}`)}> */}
//           <MenuItem onClick={() => router.push(`/geofench/${row.id}/edit`)}>

//             <Iconify icon="solar:pen-bold" />
//             Edit
//           </MenuItem>

//           <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
//             <Iconify icon="solar:trash-bin-trash-bold" />
//             Delete
//           </MenuItem>
//         </MenuList>
//       </Popover>
//     </>
//   );
// }
import { useState, useCallback } from 'react';

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

import { useDeleteGeofenceMutation } from '../../../redux/service/geofenchSlice';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: number;
  company_id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  radius: number;

  company?: {
    id: number;
    company_name: string;
  };

  user?: {
    id: number;
    name: string;
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
  const [deleteGeofence] = useDeleteGeofenceMutation();

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

    try {
      await deleteGeofence(row.id).unwrap();
      toast.success('Geofence deleted successfully');
    } catch (error) {
      toast.error('Failed to delete geofence');
    }

    handleClosePopover();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.company?.company_name}</TableCell>
        <TableCell>{row.user?.name}</TableCell>
        <TableCell>{row.latitude}</TableCell>
        <TableCell>{row.longitude}</TableCell>
        <TableCell>{row.radius}</TableCell>

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
           <MenuItem onClick={() => router.push(`edit-geofench/${row.id}`)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
