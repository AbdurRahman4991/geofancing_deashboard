import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

import {
  useGetTerritoriesQuery,
} from '../../../../../redux/service/territorySlice';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------
// Territory View
// ----------------------------------------------------------------------

export function TerritoryView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const router = useRouter();

  // ==============================
  // API
  // ==============================

  const {
    data,
    isLoading,
    isError,
  } = useGetTerritoriesQuery();

  // ==============================
  // Territories
  // ==============================

  const territories = data?.data ?? [];

  // ==============================
  // Search
  // ==============================

  const filteredTerritories = territories.filter(
    (territory) => {
      const territoryName =
        territory.name?.toLowerCase() ?? '';

      const subDistrictName =
        territory.sub_district?.name?.toLowerCase() ?? '';

      const search =
        filterName.toLowerCase();

      return (
        territoryName.includes(search) ||
        subDistrictName.includes(search)
      );
    }
  );

  // ==============================
  // Sorting
  // ==============================

  const sortedTerritories = [
    ...filteredTerritories,
  ].sort((a, b) => {
    let valueA = '';
    let valueB = '';

    // Sort by Sub District
    if (table.orderBy === 'sub_district') {
      valueA =
        a.sub_district?.name ?? '';

      valueB =
        b.sub_district?.name ?? '';
    }

    // Sort by Territory Name / Status
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
  // Create
  // ==============================

  const handleCreate = () => {
    router.push(
      '/hierarchy/create-territory'
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (isLoading) {
    return (
      <DashboardContent>
        <Typography>
          Loading territories...
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
          Failed to load territories.
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
          Territory
        </Typography>

        <Button
          onClick={handleCreate}
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New Territory
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

              {/* ============================== */}
              {/* Table Header */}
              {/* ============================== */}

              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={
                  sortedTerritories.length
                }
                numSelected={
                  table.selected.length
                }
                onSort={table.onSort}

                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sortedTerritories.map(
                      (territory) =>
                        String(
                          territory.id
                        )
                    )
                  )
                }

                headLabel={[
                  {
                    id: 'name',
                    label: 'Territory Name',
                  },
                  {
                    id: 'sub_district',
                    label: 'Sub District',
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

                {sortedTerritories.map(
                  (territory) => (
                    <UserTableRow
                      key={territory.id}
                      row={territory}
                      selected={table.selected.includes(
                        String(
                          territory.id
                        )
                      )}

                      onSelectRow={() =>
                        table.onSelectRow(
                          String(
                            territory.id
                          )
                        )
                      }
                    />
                  )
                )}

                {/* ============================== */}
                {/* No Data */}
                {/* ============================== */}

                {!sortedTerritories.length &&
                  !isLoading && (
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

      </Card>

    </DashboardContent>
  );
}

export default TerritoryView;

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