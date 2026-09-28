// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import { _users } from 'src/_mock';
// import { DashboardContent } from 'src/layouts/dashboard';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
// import { UserTableToolbar } from '../user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from '../utils';

// import type { UserProps } from '../user-table-row';
// import { useGetEmployeesQuery } from '../../../../redux/service/employeeSlice';
// import { useRouter } from 'src/routes/hooks';
// // ----------------------------------------------------------------------

// export function AttendanceRoleView() {
//   const table = useTable();
//   const [filterName, setFilterName] = useState('');

//   // API call
// // API call
// const { data, isLoading } = useGetEmployeesQuery({
//   page: table.page + 1,
//   limit: table.rowsPerPage,
//   search: filterName,
// });
//  const router = useRouter();
// // employees list
// const employees = data?.data ?? [];

// // FIX: pagination total
// const total = data?.pagination?.total ?? 0;


//   return (
//     <DashboardContent>

//       <Box
//         sx={{
//           mb: 5,
//           display: 'flex',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h4" sx={{ flexGrow: 1 }}>
//           Attendance Role
//         </Typography>
//         <Button 
//         onClick={() => router.push('create-user')}
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//         >
//           New user
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           onFilterName={(e) => setFilterName(e.target.value)}
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: "unset" }}>
//             <Table sx={{ minWidth: 800 }}>
//               <UserTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={employees.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     employees.map((emp) => String(emp.id))
//                   )
//                 }

//                 headLabel={[
//                   { id: "name", label: "Name" },
//                   { id: "employee_id", label: "Code" },
//                   { id: "phone", label: "Phone" },
//                   { id: "company_id", label: "Company" },
//                   { id: "nature_of_employment", label: "Employment" },
//                   { id: "department", label: "Department" },
//                   { id: "unit", label: "Unit" },
//                   { id: "date_of_joining", label: "Join Date" },
//                   { id: "designation", label: "Designation" },
//                   { id: "email", label: "Email" },
//                   { id: "status", label: "Status" },
//                   { id: "", label: "Action" },
//                 ]}
//               />

//               <TableBody>
//                 {employees.map((row) => (
//                   <UserTableRow
//                     key={row.id}
//                     row={row}
//                     selected={table.selected.includes(String(row.id))}
//                   onSelectRow={() => table.onSelectRow(String(row.id))}

//                   />
//                 ))}

//                 {!employees.length && !isLoading && (
//                   <TableNoData searchQuery={filterName} />
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
//   const [orderBy, setOrderBy] = useState('name');
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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
//     (inputValue: string) => {
//       const newSelected = selected.includes(inputValue)
//         ? selected.filter((value) => value !== inputValue)
//         : [...selected, inputValue];

//       setSelected(newSelected);
//     },
//     [selected]
//   );

//   const onResetPage = useCallback(() => {
//     setPage(0);
//   }, []);

//   const onChangePage = useCallback((event: unknown, newPage: number) => {
//     setPage(newPage);
//   }, []);

//   const onChangeRowsPerPage = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       setRowsPerPage(parseInt(event.target.value, 10));
//       onResetPage();
//     },
//     [onResetPage]
//   );

//   return {
//     page,
//     order,
//     onSort,
//     orderBy,
//     selected,
//     rowsPerPage,
//     onSelectRow,
//     onResetPage,
//     onChangePage,
//     onSelectAllRows,
//     onChangeRowsPerPage,
//   };
// }
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';

import { useRouter } from 'src/routes/hooks';

import {
  useGetAttendanceRolesQuery,
} from '../../../../redux/service/attendanceRoleSlice';

// ----------------------------------------------------------------------

export function AttendanceRoleView() {
  const table = useTable();

  const [filterName, setFilterName] =
    useState('');

  const router = useRouter();

  // ============================================================
  // API
  // ============================================================

  const { data, isLoading } =
    useGetAttendanceRolesQuery({
      page: table.page + 1,
      limit: table.rowsPerPage,
      search: filterName,
    });

  // ============================================================
  // RESPONSE DATA
  // ============================================================

  const attendanceRules =
    data?.data ?? [];

  // IMPORTANT
  // Your API:
  //
  // {
  //   data: [],
  //   total: 1
  // }
  //
  const total =
    data?.total ?? 0;

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterName(
      event.target.value
    );

    table.onResetPage();
  };

  // ============================================================
  // SELECT ALL
  // ============================================================

  const selectedIds =
    attendanceRules.map(
      (row) => String(row.id)
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <DashboardContent>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{ flexGrow: 1 }}
        >
          Attendance Role
        </Typography>

        <Button
          onClick={() =>
            router.push(
              '/create/attendance-role'
            )
          }
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New Attendance Role
        </Button>
      </Box>

      {/* ======================================================
          CARD
      ====================================================== */}

      <Card>
        {/* ====================================================
            SEARCH
        ==================================================== */}

        <Box sx={{ p: 2 }}>
          <input
            value={filterName}
            onChange={handleSearch}
            placeholder="Search..."
            style={{
              width: 300,
              height: 40,
              padding: '0 12px',
              border:
                '1px solid #ddd',
              borderRadius: 6,
            }}
          />
        </Box>

        {/* ====================================================
            TABLE
        ==================================================== */}

        <Scrollbar>
          <TableContainer
            sx={{
              overflow: 'unset',
            }}
          >
            <Table
              sx={{
                minWidth: 900,
              }}
            >
              {/* ==================================================
                  TABLE HEAD
              ================================================== */}

              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={
                  attendanceRules.length
                }
                numSelected={
                  table.selected.length
                }
                onSort={table.onSort}
                onSelectAllRows={(
                  checked
                ) =>
                  table.onSelectAllRows(
                    checked,
                    selectedIds
                  )
                }
                headLabel={[
                  {
                    id: 'company',
                    label: 'Company',
                  },
                  {
                    id: 'office_in_time',
                    label: 'Office In',
                  },
                  {
                    id: 'office_out_time',
                    label: 'Office Out',
                  },
                  {
                    id: 'weekend_holidays',
                    label: 'Weekend Holidays',
                  },
                  {
                    id: 'government_holidays',
                    label: 'Government Holidays',
                  },
                  {
                    id: 'is_active',
                    label: 'Status',
                  },
                  {
                    id: '',
                    label: 'Action',
                  },
                ]}
              />

              {/* ==================================================
                  TABLE BODY
              ================================================== */}

              <TableBody>
                {attendanceRules.map(
                  (row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(
                        String(row.id)
                      )}
                      onSelectRow={() =>
                        table.onSelectRow(
                          String(row.id)
                        )
                      }
                    />
                  )
                )}

                {/* NO DATA */}

                {!attendanceRules.length &&
                  !isLoading && (
                    <TableNoData
                      searchQuery={
                        filterName
                      }
                    />
                  )}

                {/* LOADING */}

                {isLoading && (
                  <TableNoData
                    searchQuery=""
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* ====================================================
            PAGINATION
        ==================================================== */}

        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={
            table.rowsPerPage
          }
          onPageChange={
            table.onChangePage
          }
          onRowsPerPageChange={
            table.onChangeRowsPerPage
          }
          rowsPerPageOptions={[
            5,
            10,
            25,
          ]}
        />
      </Card>
    </DashboardContent>
  );
}

// ======================================================================
// USE TABLE
// ======================================================================

export function useTable() {
  const [page, setPage] =
    useState(0);

  const [orderBy, setOrderBy] =
    useState('company');

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [order, setOrder] =
    useState<'asc' | 'desc'>('asc');

  // ============================================================
  // SORT
  // ============================================================

  const onSort = (
    id: string
  ) => {
    const isAsc =
      orderBy === id &&
      order === 'asc';

    setOrder(
      isAsc ? 'desc' : 'asc'
    );

    setOrderBy(id);
  };

  // ============================================================
  // SELECT ALL
  // ============================================================

  const onSelectAllRows = (
    checked: boolean,
    newSelecteds: string[]
  ) => {
    if (checked) {
      setSelected(
        newSelecteds
      );
    } else {
      setSelected([]);
    }
  };

  // ============================================================
  // SELECT SINGLE
  // ============================================================

  const onSelectRow = (
    inputValue: string
  ) => {
    const newSelected =
      selected.includes(inputValue)
        ? selected.filter(
            (value) =>
              value !== inputValue
          )
        : [
            ...selected,
            inputValue,
          ];

    setSelected(
      newSelected
    );
  };

  // ============================================================
  // RESET PAGE
  // ============================================================

  const onResetPage = () => {
    setPage(0);
  };

  // ============================================================
  // PAGE CHANGE
  // ============================================================

  const onChangePage = (
    event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // ============================================================
  // ROWS PER PAGE
  // ============================================================

  const onChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(
      parseInt(
        event.target.value,
        10
      )
    );

    onResetPage();
  };

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,

    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
