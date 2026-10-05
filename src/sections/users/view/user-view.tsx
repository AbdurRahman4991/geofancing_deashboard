import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { useGetUsersQuery } from '../../../../redux/service/userSlice';

export function UserView() {
  const table = useTable();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data, isLoading } = useGetUsersQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    search,
  });

  // getUsers normalizes both wrapped and raw Laravel paginator responses.
  const users = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
        <Button
          onClick={() => router.push('/users/create-user')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New User
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          search={search}
          onSearch={(event) => {
            setSearch(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((user) => String(user.id))
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'employee_id', label: 'Employee Code' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'designation', label: 'Designation' },
                  { id: 'company_id', label: 'Company' },
                  { id: 'status', label: 'Status' },
                  { id: 'action', label: 'Action' },
                ]}
              />

              <TableBody>
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    row={user}
                    selected={table.selected.includes(String(user.id))}
                    onSelectRow={() => table.onSelectRow(String(user.id))}
                  />
                ))}

                {!users.length && !isLoading && (
                  <TableNoData searchQuery={search} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Card>
    </DashboardContent>
  );
}

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
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      setSelected((current) =>
        current.includes(inputValue)
          ? current.filter((value) => value !== inputValue)
          : [...current, inputValue]
      );
    },
    []
  );

  const onResetPage = useCallback(() => setPage(0), []);

  const onChangePage = useCallback((_event: unknown, newPage: number) => {
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