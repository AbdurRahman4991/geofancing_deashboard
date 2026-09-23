import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

import {
  useGetEmployeeHierarchyAssignmentsQuery,
} from '../../../../../redux/service/employeeHierarchyAssignmentSlice';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function EmployeeHierarchyAssignmentView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const router = useRouter();

  // ================================================================
  // API
  // ================================================================

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetEmployeeHierarchyAssignmentsQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
    search: filterName || undefined,
  });

  // ================================================================
  // Assignments
  // ================================================================

  const assignments =
    data?.data?.data ?? [];

  // ================================================================
  // Sorting
  // ================================================================
  //
  // Backend search + pagination hocche.
  // Sorting current page-er data-r upor hocche.
  //

  const sortedAssignments =
    [...assignments].sort((a, b) => {
      let valueA = '';
      let valueB = '';

      switch (table.orderBy) {
        case 'user':
          valueA = a.user ?? '';
          valueB = b.user ?? '';
          break;

        case 'country':
          valueA = a.country ?? '';
          valueB = b.country ?? '';
          break;

        case 'region':
          valueA = a.region ?? '';
          valueB = b.region ?? '';
          break;

        case 'zone':
          valueA = a.zone ?? '';
          valueB = b.zone ?? '';
          break;

        case 'division':
          valueA = a.division ?? '';
          valueB = b.division ?? '';
          break;

        case 'district':
          valueA = a.district ?? '';
          valueB = b.district ?? '';
          break;

        case 'sub_district':
          valueA = a.sub_district ?? '';
          valueB = b.sub_district ?? '';
          break;

        case 'territory':
          valueA = a.territory ?? '';
          valueB = b.territory ?? '';
          break;

        case 'area':
          valueA = a.area ?? '';
          valueB = b.area ?? '';
          break;

        case 'assigned_by':
          valueA = a.assigned_by ?? '';
          valueB = b.assigned_by ?? '';
          break;

        case 'effective_from':
          valueA = a.effective_from ?? '';
          valueB = b.effective_from ?? '';
          break;

        default:
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
        return table.order === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return table.order === 'asc' ? 1 : -1;
      }

      return 0;
    });

  // ================================================================
  // Pagination
  // ================================================================

  const currentPage =
    (data?.data?.current_page ?? 1) - 1;

  const total =
    data?.data?.total ?? 0;

  // ================================================================
  // Create
  // ================================================================

  const handleCreate = () => {
    router.push(
      '/create/assign-hierarchy'
    );
  };

  // ================================================================
  // Loading
  // ================================================================

  if (isLoading) {
    return (
      <DashboardContent>
        <Typography>
          Loading employee hierarchy assignments...
        </Typography>
      </DashboardContent>
    );
  }

  // ================================================================
  // Error
  // ================================================================

  if (isError) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load employee hierarchy assignments.
        </Typography>
      </DashboardContent>
    );
  }

  // ================================================================
  // UI
  // ================================================================

  return (
    <DashboardContent>

      {/* ========================================================= */}
      {/* Header */}
      {/* ========================================================= */}

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
          Employee Hierarchy Assignments
        </Typography>

        <Button
          onClick={handleCreate}
          variant="contained"
          color="inherit"
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          New Assignment
        </Button>
      </Box>

      {/* ========================================================= */}
      {/* Table Card */}
      {/* ========================================================= */}

      <Card>

        {/* ======================================================= */}
        {/* Toolbar */}
        {/* ======================================================= */}

        <UserTableToolbar
          numSelected={
            table.selected.length
          }
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);

            // Search change hole first page-e jabe
            table.onResetPage();
          }}
        />

        {/* ======================================================= */}
        {/* Fetching */}
        {/* ======================================================= */}

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
                minWidth: 1800,
              }}
            >

              {/* ================================================= */}
              {/* Table Header */}
              {/* ================================================= */}

              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={
                  sortedAssignments.length
                }
                numSelected={
                  table.selected.length
                }
                onSort={table.onSort}

                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    sortedAssignments.map(
                      (assignment) =>
                        String(
                          assignment.id
                        )
                    )
                  )
                }

                headLabel={[
                  {
                    id: 'user',
                    label: 'User',
                  },
                  {
                    id: 'country',
                    label: 'Country',
                  },
                  {
                    id: 'region',
                    label: 'Region',
                  },
                  {
                    id: 'zone',
                    label: 'Zone',
                  },
                  {
                    id: 'division',
                    label: 'Division',
                  },
                  {
                    id: 'district',
                    label: 'District',
                  },
                  {
                    id: 'sub_district',
                    label: 'Sub District',
                  },
                  {
                    id: 'territory',
                    label: 'Territory',
                  },
                  {
                    id: 'area',
                    label: 'Area',
                  },
                  {
                    id: 'effective_from',
                    label: 'Effective From',
                  },
                  {
                    id: 'is_current',
                    label: 'Status',
                  },
                  {
                    id: 'assigned_by',
                    label: 'Assigned By',
                  },
                  {
                    id: 'reason',
                    label: 'Reason',
                  },
                  {
                    id: '',
                    label: 'Action',
                  },
                ]}
              />

              {/* ================================================= */}
              {/* Table Body */}
              {/* ================================================= */}

              <TableBody>

                {sortedAssignments.map(
                  (assignment) => (
                    <UserTableRow
                      key={assignment.id}
                      row={{
                        ...assignment,

                        // Display-friendly values
                        user:
                          assignment.user ?? 'N/A',

                        country:
                          assignment.country ?? 'N/A',

                        region:
                          assignment.region ?? 'N/A',

                        zone:
                          assignment.zone ?? 'N/A',

                        division:
                          assignment.division ?? 'N/A',

                        district:
                          assignment.district ?? 'N/A',

                        sub_district:
                          assignment.sub_district ?? 'N/A',

                        territory:
                          assignment.territory ?? 'N/A',

                        area:
                          assignment.area ?? 'N/A',

                        assigned_by:
                          assignment.assigned_by ?? 'N/A',

                        reason:
                          assignment.reason ?? 'N/A',
                      }}
                      selected={table.selected.includes(
                        String(
                          assignment.id
                        )
                      )}
                      onSelectRow={() =>
                        table.onSelectRow(
                          String(
                            assignment.id
                          )
                        )
                      }
                    />
                  )
                )}

                {/* ================================================= */}
                {/* No Data */}
                {/* ================================================= */}

                {!sortedAssignments.length &&
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

        {/* ======================================================= */}
        {/* Pagination */}
        {/* ======================================================= */}

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

export default EmployeeHierarchyAssignmentView;

// ----------------------------------------------------------------------
// TABLE HOOK
// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] =
    useState(0);

  const [orderBy, setOrderBy] =
    useState('user');

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [order, setOrder] =
    useState<'asc' | 'desc'>('asc');

  // ================================================================
  // Sort
  // ================================================================

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

  // ================================================================
  // Select All
  // ================================================================

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

  // ================================================================
  // Select Row
  // ================================================================

  const onSelectRow =
    useCallback(
      (inputValue: string) => {
        const newSelected =
          selected.includes(
            inputValue
          )
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

  // ================================================================
  // Reset Page
  // ================================================================

  const onResetPage =
    useCallback(() => {
      setPage(0);
    }, []);

  // ================================================================
  // Change Page
  // ================================================================

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

  // ================================================================
  // Change Rows Per Page
  // ================================================================

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
