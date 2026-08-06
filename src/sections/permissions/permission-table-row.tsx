
// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Popover from '@mui/material/Popover';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuList from '@mui/material/MenuList';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

// import { useRouter } from 'src/routes/hooks';
// import { Iconify } from 'src/components/iconify';

// import { useDeleteGeofenceMutation } from '../../../redux/service/geofenchSlice';
// import { toast } from 'react-toastify';

// // ----------------------------------------------------------------------

// export type UserProps = {
//   id: number;
//   // company_id: number;
//   user_id: number;
//   latitude: number;
//   longitude: number;
//   radius: number;

//   // company?: {
//   //   id: number;
//   //   company_name: string;
//   // };

//   user?: {
//     id: number;
//     name: string;
//     employee_id: number;

//     employee?: {
//       id: number;
//       name: string;
//       employee_id: string;
//     };
//   };
// };

// type UserTableRowProps = {
//   row: UserProps;
//   selected: boolean;
//   onSelectRow: () => void;
// };

// export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
//   const [openPopover, setOpenPopover] =
//     useState<HTMLButtonElement | null>(null);

//   const router = useRouter();
//   const [deleteGeofence] = useDeleteGeofenceMutation();

//   const handleOpenPopover = useCallback(
//     (event: React.MouseEvent<HTMLButtonElement>) => {
//       setOpenPopover(event.currentTarget);
//     },
//     []
//   );

//   const handleClosePopover = useCallback(() => {
//     setOpenPopover(null);
//   }, []);

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this geofence?')) return;

//     try {
//       await deleteGeofence(row.id).unwrap();
//       toast.success('Permission deleted successfully');
//     } catch (error) {
//       toast.error('Failed to delete geofence');
//     }

//     handleClosePopover();
//   };

//   return (
//     <>
//       <TableRow hover selected={selected}>
//         <TableCell padding="checkbox">
//           <Checkbox checked={selected} onChange={onSelectRow} />
//         </TableCell>

//             {/* <TableCell>{row.company?.company_name ?? '-'}</TableCell> */}

//             <TableCell>{row.user?.employee?.name ?? '-'}</TableCell>

//             <TableCell>{row.user?.employee?.employee_id ?? '-'}</TableCell>

//             <TableCell>{row.latitude}</TableCell>

//             <TableCell>{row.longitude}</TableCell>

//             <TableCell>{row.radius}</TableCell>

//         <TableCell align="right">
//           <IconButton onClick={handleOpenPopover}>
//             <Iconify icon="eva:more-vertical-fill" />
//           </IconButton>
//         </TableCell>
//       </TableRow>

//       <Popover
//         open={Boolean(openPopover)}
//         anchorEl={openPopover}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <MenuList
//           disablePadding
//           sx={{
//             p: 0.5,
//             width: 140,
//             display: 'flex',
//             flexDirection: 'column',
//             [`& .${menuItemClasses.root}`]: {
//               px: 1,
//               gap: 2,
//               borderRadius: 0.75,
//             },
//           }}
//         >
//            <MenuItem onClick={() => router.push(`edit-geofench/${row.id}`)}>
//             <Iconify icon="solar:pen-bold" />
//             Edit
//           </MenuItem>

//           {/* <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
//             <Iconify icon="solar:trash-bin-trash-bold" />
//             Delete
//           </MenuItem> */}
//         </MenuList>
//       </Popover>
//     </>
//   );
// }
import { useState, useCallback } from "react";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { useRouter } from "src/routes/hooks";
import { Iconify } from "src/components/iconify";

export type PermissionProps = {
  id: number;
  name: string;
  guard_name: string;
};

type Props = {
  row: PermissionProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function PermissionTableRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const router = useRouter();

  const [openPopover, setOpenPopover] =
    useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.guard_name}</TableCell>

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
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            width: 150,
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
            },
          }}
        >
          <MenuItem
            onClick={() => router.push(`/permissions/edit-permission/${row.id}`)}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}