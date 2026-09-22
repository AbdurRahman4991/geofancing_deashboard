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

import {
  useGetAreasQuery,
} from '../../../../../redux/service/areaSlice';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function AreaView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  // Territory filter
  const [territoryId, setTerritoryId] = useState<number | undefined>(
    undefined
  );

  const router = useRouter();

  // ==============================
  // API
  // ==============================

  const {
    data,
    isLoading,
    isError,
  } = useGetAreasQuery({
    search: filterName,
    territory_id: territoryId,
    page: table.page + 1,
    per_page: table.rowsPerPage,
  });

  // ==============================
  // Areas
  // ==============================

  const areas = data?.data ?? [];

  // ==============================
  // Create
  // ==============================

  const handleCreate = () => {
    router.push('/hierarchy/create-area');
  };

  // ==============================
  // Loading
  // ==============================

  if (isLoading) {
    return (
      <DashboardContent>
        <Typography>
          Loading areas...
        </Typography>
      </DashboardContent>
    );
  }

  // ==============================
  // Error
  // ==============================

  if (isError) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load areas.
        </Typography>
      </DashboardContent>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <DashboardContent>

      {/* Header */}

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
          Area
        </Typography>

        <Button
          onClick={handleCreate}
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New Area
        </Button>
      </Box>

      <Card>

        {/* Toolbar */}

        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);

            // Search করলে first page-এ যাবে
            table.onResetPage();
          }}
        />

        <Scrollbar>

          <TableContainer
            sx={{ overflow: 'unset' }}
          >

            <Table
              sx={{
                minWidth: 900,
              }}
            >

              {/* Header */}

              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={areas.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    areas.map((area) =>
                      String(area.id)
                    )
                  )
                }
                headLabel={[
                  {
                    id: 'name',
                    label: 'Area Name',
                  },
                  {
                    id: 'territory',
                    label: 'Territory',
                  },
                  {
                    id: 'status',
                    label: 'Status',
                  },
                  {
                    id: '',
                    label: 'Action',
                  },
                ]}
              />

              {/* Body */}

              <TableBody>

                {areas.map((area) => (
                  <UserTableRow
                    key={area.id}
                    row={area}
                    selected={table.selected.includes(
                      String(area.id)
                    )}
                    onSelectRow={() =>
                      table.onSelectRow(
                        String(area.id)
                      )
                    }
                  />
                ))}

                {!areas.length && !isLoading && (
                  <TableNoData
                    searchQuery={filterName}
                  />
                )}

              </TableBody>

            </Table>

          </TableContainer>

        </Scrollbar>

        {/* Pagination */}

        <TablePagination
          component="div"
          page={table.page}
          count={data?.meta.total ?? 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={
            table.onChangeRowsPerPage
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

      </Card>

    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
// TABLE HOOK
// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);

  const [orderBy, setOrderBy] =
    useState('name');

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [order, setOrder] =
    useState<'asc' | 'desc'>('asc');

  // ==============================
  // Sort
  // ==============================

  const onSort = useCallback(
    (id: string) => {
      const isAsc =
        orderBy === id &&
        order === 'asc';

      setOrder(
        isAsc ? 'desc' : 'asc'
      );

      setOrderBy(id);
    },
    [order, orderBy]
  );

  // ==============================
  // Select All
  // ==============================

  const onSelectAllRows =
    useCallback(
      (
        checked: boolean,
        newSelecteds: string[]
      ) => {
        if (checked) {
          setSelected(newSelecteds);
          return;
        }

        setSelected([]);
      },
      []
    );

  // ==============================
  // Select Row
  // ==============================

  const onSelectRow =
    useCallback(
      (inputValue: string) => {
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

        setSelected(newSelected);
      },
      [selected]
    );

  // ==============================
  // Reset Page
  // ==============================

  const onResetPage =
    useCallback(() => {
      setPage(0);
    }, []);

  // ==============================
  // Change Page
  // ==============================

  const onChangePage =
    useCallback(
      (
        event: unknown,
        newPage: number
      ) => {
        setPage(newPage);
      },
      []
    );

  // ==============================
  // Change Rows Per Page
  // ==============================

  const onChangeRowsPerPage =
    useCallback(
      (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setRowsPerPage(
          parseInt(
            event.target.value,
            10
          )
        );

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

export default AreaView;