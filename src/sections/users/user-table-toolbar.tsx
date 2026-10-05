// import Tooltip from '@mui/material/Tooltip';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';

// import { Iconify } from 'src/components/iconify';

// // ----------------------------------------------------------------------

// type UserTableToolbarProps = {
//   numSelected: number;
//   filterName: string;
//   onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
// };

// export function UserTableToolbar({ numSelected, filterName,  onFilterName }: UserTableToolbarProps) {
//   return (
//     <Toolbar
//       sx={{
//         height: 96,
//         display: 'flex',
//         justifyContent: 'space-between',
//         p: (theme) => theme.spacing(0, 1, 0, 3),
//         ...(numSelected > 0 && {
//           color: 'primary.main',
//           bgcolor: 'primary.lighter',
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography component="div" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <OutlinedInput
//           fullWidth
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search user..."
//           startAdornment={
//             <InputAdornment position="start">
//               <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
//             </InputAdornment>
//           }
//           sx={{ maxWidth: 320 }}
//         />
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <Iconify icon="solar:trash-bin-trash-bold" />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <Iconify icon="ic:round-filter-list" />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// }
import type { ChangeEvent } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "src/components/iconify";

type UserTableToolbarProps = {
  numSelected: number;
  search: string;
  department: string;
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onDepartmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UserTableToolbar({
  numSelected,
  search,
  department,
  onSearch,
  onDepartmentChange,
}: UserTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        minHeight: 90,
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(2, 3),
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          {/* Search */}
          <OutlinedInput
            fullWidth
            value={search}
            onChange={onSearch}
            placeholder="Search Name / Employee ID / Phone"
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  width={20}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
          />

          {/* Department */}
          <OutlinedInput
            fullWidth
            value={department}
            onChange={onDepartmentChange}
            placeholder="Department"
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="mdi:office-building"
                  width={20}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
          />
        </Box>
      )}

      {numSelected === 0 && (
        <Tooltip title="Filter">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}