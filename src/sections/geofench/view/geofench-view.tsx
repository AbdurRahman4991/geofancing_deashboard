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
import { UserTableToolbar } from '../user-table-toolbar';

import { useGetGeofencesQuery } from '../../../../redux/service/geofenchSlice';
import { useRouter } from 'src/routes/hooks';
// ----------------------------------------------------------------------


export function GeofenchView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const { data, isLoading } = useGetGeofencesQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    search: filterName,
  });
  const router = useRouter();
  const geofences = data?.data ?? [];
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
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 1100 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={geofences.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
               onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    geofences.map((geofence) => String(geofence.id))
                  )
                }

                headLabel={[
                  { id: "firm_name", label: "Firm Name" },
                  { id: "address", label: "Address" },
                  { id: "hierarchy_node_id", label: "Hierarchy Node" },
                  { id: "radius", label: "Radius (M)" },
                  { id: "visit_status", label: "Visit Status" },
                  { id: "", label: "Action" },
                ]}
              />

              <TableBody>
                {geofences.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(String(row.id))}
                  onSelectRow={() => table.onSelectRow(String(row.id))}

                  />
                ))}

                {!geofences.length && !isLoading && (
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
  const [orderBy, setOrderBy] = useState('firm_name');
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
