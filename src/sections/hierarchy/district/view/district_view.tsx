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
  useGetDistrictsQuery,
} from '../../../../../redux/service/districtSlice';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function DistrictView() {
  const table = useTable();

  const [filterName, setFilterName] =
    useState('');

  const router = useRouter();

  // ==============================
  // API
  // ==============================

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetDistrictsQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    search: filterName || undefined,
  });

  // ==============================
  // Districts
  // ==============================

  const districts =
    data?.data?.data ?? [];

  // ==============================
  // Sorting
  // ==============================
  //
  // Search + pagination backend-e hocche.
  // Sorting ekhane current page-er data-r
  // upor hocche.
  //

  const sortedDistricts = [
    ...districts,
  ].sort((a, b) => {
    let valueA = '';
    let valueB = '';

    // Sort by Division
    if (table.orderBy === 'division') {
      valueA =
        a.division?.name ?? '';

      valueB =
        b.division?.name ?? '';
    }

    // Sort by District Name / Status
    else {
      valueA = String(
        a[
          table.orderBy as keyof typeof a
        ] ?? ''
      );

      valueB = String(
        b[
          table.orderBy as keyof typeof b
        ] ?? ''
      );
    }

    if (valueA < valueB) {
      return table.order === 'asc'
        ? -1
        : 1;
    }

    if (valueA > valueB) {
      return table.order === 'asc'
        ? 1
        : -1;
    }

    return 0;
  });

  // ==============================
  // Pagination
  // ==============================

  const currentPage =
    (data?.data?.current_page ?? 1) - 1;

  const total =
    data?.data?.total ?? 0;

  // ==============================
  // Create
  // ==============================

  const handleCreate = () => {
    router.push(
      '/hierarchy/create-district'
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (isLoading) {
    return (
      <DashboardContent>
        <Typography>
          Loading districts...
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
          Failed to load districts.
        </Typography>
      </DashboardContent>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <DashboardContent>

      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

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
          District
        </Typography>

        <Button
          onClick={handleCreate}
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New District
        </Button>
      </Box>

      {/* ============================== */}
      {/* Table Card */}
      {/* ============================== */}

      <Card>

        {/* ============================== */}
        {/* Toolbar */}
        {/* ============================== */}

        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(
              e.target.value
            );

            // Search change hole
            // first page-e jabe
            table.onResetPage();
          }}
        />

        {/* ============================== */}
        {/* Fetching */}
        {/* ============================== */}

        {isFetching && (
          <Box
            sx={{
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading...
            </Typography>
          </Box>
        )}

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

              {/* ============================== */}
              {/* Table Header */}
              {/* ============================== */}

              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={
                  sortedDistricts.length
                }
                numSelected={
                  table.selected.length
                }
                onSort={table.onSort}

                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sortedDistricts.map(
                      (district) =>
                        String(
                          district.id
                        )
                    )
                  )
                }

                headLabel={[
                  {
                    id: 'name',
                    label: 'District Name',
                  },
                  {
                    id: 'division',
                    label: 'Division',
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

              {/* ============================== */}
              {/* Table Body */}
              {/* ============================== */}

              <TableBody>

                {sortedDistricts.map(
                  (district) => (
                    <UserTableRow
                      key={district.id}
                      row={district}
                      selected={table.selected.includes(
                        String(
                          district.id
                        )
                      )}
                      onSelectRow={() =>
                        table.onSelectRow(
                          String(
                            district.id
                          )
                        )
                      }
                    />
                  )
                )}

                {/* ============================== */}
                {/* No Data */}
                {/* ============================== */}

                {!sortedDistricts.length &&
                  !isFetching && (
                    <TableNoData
                      searchQuery={
                        filterName
                      }
                    />
                  )}

              </TableBody>

            </Table>

          </TableContainer>

        </Scrollbar>

        {/* ============================== */}
        {/* Pagination */}
        {/* ============================== */}

        <TablePagination
          component="div"
          page={currentPage}
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
            50,
          ]}
        />

      </Card>

    </DashboardContent>
  );
}

export default DistrictView;

// ----------------------------------------------------------------------
// TABLE HOOK
// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] =
    useState(0);

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
        isAsc
          ? 'desc'
          : 'asc'
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
          setSelected(
            newSelecteds
          );

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
          selected.includes(
            inputValue
          )
            ? selected.filter(
                (value) =>
                  value !==
                  inputValue
              )
            : [
                ...selected,
                inputValue,
              ];

        setSelected(
          newSelected
        );
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