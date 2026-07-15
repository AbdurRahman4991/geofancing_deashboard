import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";

import { Iconify } from "src/components/iconify";

type UserTableToolbarProps = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;

  year: string;
  onYearChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  month: string;
  onMonthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UserTableToolbar({
  filterName,
  onFilterName,
  year,
  onYearChange,
  month,
  onMonthChange,
}: UserTableToolbarProps) {
  const years = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Toolbar
      sx={{
        py: 2,
      }}
    >
      <Grid container spacing={2} width="100%">
        <Grid size={{ xs: 12, md: 4 }}>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search Name / Employee ID"
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  width={20}
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Year"
            value={year}
            onChange={onYearChange}
          >
            <MenuItem value="">All</MenuItem>

            {years.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Month"
            value={month}
            onChange={onMonthChange}
          >
            <MenuItem value="">All</MenuItem>

            {months.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Toolbar>
  );
}