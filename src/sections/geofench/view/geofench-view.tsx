import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { useGetGeofencesQuery } from '../../../../redux/service/geofenchSlice';
import { useGetUsersQuery } from '../../../../redux/service/userSlice';
import { useRouter } from 'src/routes/hooks';
// ----------------------------------------------------------------------


export function GeofenchView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [userId, setUserId] = useState('');
  const { data: usersData } = useGetUsersQuery({ page: 1, per_page: 1000 });

  // API call
// API call
const { data, isLoading } = useGetGeofencesQuery({
  page: table.page + 1,
  limit: table.rowsPerPage,
  search: filterName,
  user_id: userId,
   per_page: table.rowsPerPage,
});
 const router = useRouter();
// employees list
const employees = data?.data ?? [];

// FIX: pagination total
const total = data?.pagination?.total ?? 0;


  return (
    <DashboardContent>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Geofench
        </Typography>
        <Button 
        onClick={() => router.push('create-geofench')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Geofench
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 220, mx: 3, mb: 2 }}>
          <InputLabel id="geofence-user-filter-label">Filter by user</InputLabel>
          <Select<string>
            labelId="geofence-user-filter-label"
            value={userId}
            label="Filter by user"
            onChange={(event) => {
              setUserId(event.target.value);
              table.onResetPage();
            }}
          >
            <MenuItem value="">All users</MenuItem>
            {(usersData?.data ?? []).map((user) => (
              <MenuItem key={user.id} value={String(user.id)}>
                {user.employee?.name || user.name || user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={employees.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
               onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    employees.map((emp) => String(emp.id))
                  )
                }

                headLabel={[
                    { id: "name", label: "Area name" },
                    // { id: "employee_id", label: "Code" },
                    { id: "address", label: "Address" },
                    { id: "radius", label: "Radius (M)" },
                    { id: "visit_status", label: "Visit Status" },
                    { id: "", label: "Action" },
                  ]}
              />

              <TableBody>
                {employees.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(String(row.id))}
                  onSelectRow={() => table.onSelectRow(String(row.id))}

                  />
                ))}

                {!employees.length && !isLoading && (
                  <TableNoData searchQuery={filterName} />
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
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[10]}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "right", px: 2, pb: 1 }}>Map data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></Typography>
      </Card>
    </DashboardContent>
  );
}


// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

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







