
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

import { NotificationTableRow } from '../notification-table-row';

import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from '../../../../redux/service/notificationSlice';

// ----------------------------------------------------------------------

export function NotificationView() {

  const table = useTable();

  const [filterName, setFilterName] = useState('');

  // GET NOTIFICATIONS
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery({
    page: table.page + 1,
    per_page: table.rowsPerPage,
  });

  // MARK AS READ
  const [markAsRead] =
    useMarkNotificationAsReadMutation();

  // DELETE NOTIFICATION
  const [deleteNotification] =
    useDeleteNotificationMutation();

  // API DATA
  const notifications = response?.data?.data ?? [];

  const total = response?.data?.total ?? 0;

  // SEARCH FILTER
  const filteredNotifications = notifications.filter((notification) => {
    const search = filterName.toLowerCase();

    return (
      notification.data.title.toLowerCase().includes(search) ||
      notification.data.message.toLowerCase().includes(search) ||
      notification.data.employee_name.toLowerCase().includes(search) ||
      (notification.data.hierarchy_node_name ?? '')
        .toLowerCase()
        .includes(search)
    );
  });

  // MARK SINGLE NOTIFICATION AS READ
  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsRead(id).unwrap();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
    [markAsRead]
  );

  // DELETE NOTIFICATION
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteNotification(id).unwrap();
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [deleteNotification]
  );

  return (
    <DashboardContent>

      {/* HEADER */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Notifications
        </Typography>
      </Box>

      <Card>

        {/* TOOLBAR */}
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 1200 }}>

              {/* TABLE HEADER */}
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={filteredNotifications.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    filteredNotifications.map((item) => item.id)
                  )
                }
                headLabel={[
                  { id: 'title', label: 'Title' },
                  { id: 'message', label: 'Message' },
                  { id: 'employee_name', label: 'Employee' },
                  { id: 'hierarchy_node_name', label: 'Hierarchy Node' },
                  { id: 'type', label: 'Type' },
                  { id: 'read_at', label: 'Status' },
                  { id: 'created_at', label: 'Created At' },
                  { id: '', label: 'Action' },
                ]}
              />

              {/* TABLE BODY */}
              <TableBody>

                {filteredNotifications.map((row) => (
                  <NotificationTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}

                {!isLoading && filteredNotifications.length === 0 && (
                  <TableNoData searchQuery={filterName} />
                )}

                {isLoading && (
                  <TableRowLoading />
                )}

                {isError && (
                  <TableRowError onRetry={refetch} />
                )}

              </TableBody>

            </Table>
          </TableContainer>
        </Scrollbar>

        {/* PAGINATION */}
        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />

      </Card>

    </DashboardContent>
  );
}
export default NotificationView ;

// ----------------------------------------------------------------------
// LOADING
// ----------------------------------------------------------------------

function TableRowLoading() {
  return (
    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={28} />
    </Box>
  );
}

// ----------------------------------------------------------------------
// ERROR
// ----------------------------------------------------------------------

function TableRowError({ onRetry }: { onRetry: () => void }) {
  return (
    <Box sx={{ py: 3, textAlign: 'center' }}>
      <Typography color="error" sx={{ mb: 1 }}>
        Failed to load notifications.
      </Typography>

      <Button onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}

// ----------------------------------------------------------------------
// TABLE HOOK
// ----------------------------------------------------------------------

export function useTable() {

  const [page, setPage] = useState(0);

  const [orderBy, setOrderBy] = useState('created_at');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selected, setSelected] = useState<string[]>([]);

  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';

      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: string[]) => {
      if (checked) {
        setSelected(newSelecteds);
        return;
      }

      setSelected([]);
    },
    []
  );

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

  const onChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);
    },
    []
  );

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
    orderBy,
    selected,
    rowsPerPage,
    onSort,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
