// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import { DashboardContent } from 'src/layouts/dashboard';
// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { UserTableToolbar } from '../user-table-toolbar';

// import { useGetEmployeeLocationsQuery } from '../../../../redux/service/employeeLocationSlice';
// import { useRouter } from 'src/routes/hooks';

// // ----------------------------------------------------------------------

// export function EmployeeLocationView() {
//   const table = useTable();
//   const [filterEmployeeId, setFilterEmployeeId] = useState('');

//   const router = useRouter();

//   // ===========================
//   // API CALL (Employee Locations)
//   // ===========================
//   const { data, isLoading } = useGetEmployeeLocationsQuery({
//     page: table.page + 1,
//     per_page: table.rowsPerPage,
//     employee_id: filterEmployeeId,
//   });

//   // list
//   const locations = data?.data ?? [];

//   // pagination total
//   const total = data?.total ?? 0;

//   return (
//     <DashboardContent>
//       <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
//         <Typography variant="h4" sx={{ flexGrow: 1 }}>
//           Employee Locations
//         </Typography>

//         <Button
//           onClick={() => router.push('create-location')}
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//         >
//           New Location
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={table.selected.length}
//           filterName={filterEmployeeId}
//           onFilterName={(e) => setFilterEmployeeId(e.target.value)}
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 900 }}>
//               <UserTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={locations.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     locations.map((item) => String(item.id))
//                   )
//                 }
//                 headLabel={[
//                   { id: 'employee.name', label: 'Employee' },
//                   { id: 'employee.employee_id', label: 'Employee Code' },
//                   { id: 'latitude', label: 'Latitude' },
//                   { id: 'longitude', label: 'Longitude' },
//                   { id: 'created_at', label: 'Time' },
//                   { id: '', label: 'Action' },
//                 ]}
//               />

//               <TableBody>
//                 {locations.map((row) => (
//                   <UserTableRow
//                     key={row.id}
//                     row={row}
//                     selected={table.selected.includes(String(row.id))}
//                     onSelectRow={() => table.onSelectRow(String(row.id))}
//                   />
//                 ))}

//                 {!locations.length && !isLoading && (
//                   <TableNoData searchQuery={filterEmployeeId} />
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           page={table.page}
//           count={total}
//           rowsPerPage={table.rowsPerPage}
//           onPageChange={table.onChangePage}
//           rowsPerPageOptions={[10]}
//         />
//       </Card>
//     </DashboardContent>
//   );
// }

// // ----------------------------------------------------------------------

// export function useTable() {
//   const [page, setPage] = useState(0);
//   const [orderBy, setOrderBy] = useState('created_at');
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [order, setOrder] = useState<'asc' | 'desc'>('desc');

//   const onSort = useCallback(
//     (id: string) => {
//       const isAsc = orderBy === id && order === 'asc';
//       setOrder(isAsc ? 'desc' : 'asc');
//       setOrderBy(id);
//     },
//     [order, orderBy]
//   );

//   const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
//     if (checked) {
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   }, []);

//   const onSelectRow = useCallback(
//     (id: string) => {
//       const newSelected = selected.includes(id)
//         ? selected.filter((value) => value !== id)
//         : [...selected, id];

//       setSelected(newSelected);
//     },
//     [selected]
//   );

//   const onChangePage = useCallback((event: unknown, newPage: number) => {
//     setPage(newPage);
//   }, []);

//   const onChangeRowsPerPage = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       setRowsPerPage(parseInt(event.target.value, 10));
//       setPage(0);
//     },
//     []
//   );

//   return {
//     page,
//     order,
//     orderBy,
//     selected,
//     rowsPerPage,
//     onSort,
//     onSelectRow,
//     onSelectAllRows,
//     onChangePage,
//     onChangeRowsPerPage,
//   };
// }
import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";

import { TableNoData } from "../table-no-data";
import { UserTableRow } from "../user-table-row";
import { UserTableHead } from "../user-table-head";

import { useRouter } from "src/routes/hooks";
import { useGetEmployeeLocationsQuery } from "../../../../redux/service/employeeLocationSlice";

export function EmployeeLocationView() {
  const table = useTable();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    table.onResetPage();
  }, [search, fromDate, toDate]);

  const { data, isLoading } = useGetEmployeeLocationsQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    search,
    from_date: fromDate,
    to_date: toDate,
  });

  const locations = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Employee Locations
        </Typography>

        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push("create-location")}
        >
          New Location
        </Button> */}
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Name / Employee ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                color="error"
                variant="outlined"
                sx={{ height: "56px" }}
                onClick={() => {
                  setSearch("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Scrollbar>
          <TableContainer>
            <Table>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={locations.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    locations.map((item: any) => String(item.id))
                  )
                }
                headLabel={[
                  { id: "employee.name", label: "Employee" },
                  { id: "employee.employee_id", label: "Employee Code" },
                  { id: "latitude", label: "Latitude" },
                  { id: "longitude", label: "Longitude" },
                  { id: "created_at", label: "Time" },
                  { id: "", label: "Action" },
                ]}
              />

              <TableBody>
                {locations.map((row: any) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(String(row.id))}
                    onSelectRow={() =>
                      table.onSelectRow(String(row.id))
                    }
                  />
                ))}

                {!locations.length && !isLoading && (
                  <TableNoData searchQuery={search} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("created_at");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, ids: string[]) => {
      setSelected(checked ? ids : []);
    },
    []
  );

  const onSelectRow = useCallback(
    (id: string) => {
      setSelected((prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
      );
    },
    []
  );

  const onChangePage = useCallback(
    (_: unknown, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    onSort,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
    onResetPage,
  };
}