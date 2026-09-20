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
  useGetSubDistrictsQuery,
} from '../../../../../redux/service/subDistrictSlice';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function SubDistrictView() {
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
  } = useGetSubDistrictsQuery();

  // ==============================
  // SubDistricts
  // ==============================

  const subDistricts = data?.data ?? [];

  // ==============================
  // Search
  // ==============================

  const filteredSubDistricts = subDistricts.filter(
    (subDistrict) => {
      const subDistrictName =
        subDistrict.name?.toLowerCase() ?? '';

      const districtName =
        subDistrict.district?.name?.toLowerCase() ?? '';

      const search =
        filterName.toLowerCase();

      return (
        subDistrictName.includes(search) ||
        districtName.includes(search)
      );
    }
  );

  // ==============================
  // Sorting
  // ==============================

  const sortedSubDistricts = [
    ...filteredSubDistricts,
  ].sort((a, b) => {
    let valueA = '';
    let valueB = '';

    // Sort by District
    if (table.orderBy === 'district') {
      valueA =
        a.district?.name ?? '';

      valueB =
        b.district?.name ?? '';
    }

    // Sort by SubDistrict Name / Status
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
      '/hierarchy/create-sub-district'
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (isLoading) {
    return (
      <DashboardContent>
        <Typography>
          Loading sub districts...
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
          Failed to load sub districts.
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
          Sub District
        </Typography>

        <Button
          onClick={handleCreate}
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New Sub District
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
                  sortedSubDistricts.length
                }
                numSelected={
                  table.selected.length
                }
                onSort={table.onSort}

                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sortedSubDistricts.map(
                      (subDistrict) =>
                        String(
                          subDistrict.id
                        )
                    )
                  )
                }

                headLabel={[
                  {
                    id: 'name',
                    label: 'Sub District Name',
                  },
                  {
                    id: 'district',
                    label: 'District',
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

                {sortedSubDistricts.map(
                  (subDistrict) => (
                    <UserTableRow
                      key={subDistrict.id}
                      row={subDistrict}
                      selected={table.selected.includes(
                        String(
                          subDistrict.id
                        )
                      )}

                      onSelectRow={() =>
                        table.onSelectRow(
                          String(
                            subDistrict.id
                          )
                        )
                      }
                    />
                  )
                )}

                {/* ============================== */}
                {/* No Data */}
                {/* ============================== */}

                {!sortedSubDistricts.length &&
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

export default SubDistrictView;

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
