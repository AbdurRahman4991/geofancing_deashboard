import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';

import { useGetCompanyQuery } from '../../../../redux/service/companySlice';

export function CompanyView() {
  const [page, setPage] = useState(1); // ✅ server uses 1-based page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  // ✅ call API
  const { data, isLoading, isError } = useGetCompanyQuery({ page, limit: rowsPerPage });
  const companies = data?.data || [];
  const pagination = data?.pagination;

  const notFound = !companies.length && !!filterName;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1); // MUI TablePagination uses 0-based index
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Company
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          New company
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => setFilterName(event.target.value)}
        />

        {isLoading ? (
          <Typography sx={{ p: 3 }}>Loading...</Typography>
        ) : isError ? (
          <Typography sx={{ p: 3, color: 'error.main' }}>Failed to load companies.</Typography>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order="asc"
                    orderBy="company_name"
                    rowCount={companies.length}
                    numSelected={0}
                    onSort={() => {}}
                    onSelectAllRows={() => {}}
                    headLabel={[
                      { id: 'name', label: 'Name' },
                      { id: 'email', label: 'Email' },
                      { id: 'phone', label: 'Phone' },
                      { id: 'address', label: 'Address' },
                      { id: 'verified', label: 'Verified' },
                      { id: 'status', label: 'Status' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {companies.map((row) => (
                      <UserTableRow key={row.id} row={row} selected={false} onSelectRow={() => {}} />
                    ))}

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={(pagination?.current_page || 1) - 1}
              count={pagination?.total || 0}
              rowsPerPage={pagination?.per_page || rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}


// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
