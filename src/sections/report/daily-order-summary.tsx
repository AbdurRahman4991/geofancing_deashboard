import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetOrdersQuery, type Order } from '../../../redux/service/orderSlice';

const todayLocal = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateInLocalTimezone = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatAmount = (value: string | number) =>
  Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'delivered': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

function SummaryCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
      {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
    </Card>
  );
}

export default function DailyOrderSummary() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const companyId = getCurrentCompanyId();
  const { data, isLoading, isError } = useGetOrdersQuery(
    { company_id: companyId, page: 1, per_page: 1000 },
    { skip: !companyId }
  );

  const dailyOrders = useMemo(
    () => (data?.data.data ?? []).filter((order) => dateInLocalTimezone(order.created_at) === selectedDate),
    [data, selectedDate]
  );
  const counts = useMemo(() => ({
    total: dailyOrders.length,
    delivered: dailyOrders.filter((order) => order.status.toLowerCase() === 'delivered').length,
    pending: dailyOrders.filter((order) => order.status.toLowerCase() === 'pending').length,
    cancelled: dailyOrders.filter((order) => order.status.toLowerCase() === 'cancelled').length,
    value: dailyOrders
      .filter((order) => order.status.toLowerCase() !== 'cancelled')
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
  }), [dailyOrders]);

  return (
    <DashboardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Daily Order Summary</Typography>
        <TextField
          label="Report date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Stack>

      {isError ? (
        <Typography color="error">Could not load orders for this report.</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total orders" value={isLoading ? '—' : counts.total} /></Grid>
            <Grid item xs={12} sm={6} md={3}><SummaryCard title="Delivered" value={isLoading ? '—' : counts.delivered} /></Grid>
            <Grid item xs={12} sm={6} md={3}><SummaryCard title="Pending" value={isLoading ? '—' : counts.pending} helper={`${counts.cancelled} cancelled`} /></Grid>
            <Grid item xs={12} sm={6} md={3}><SummaryCard title="Net order value" value={isLoading ? '—' : formatAmount(counts.value)} helper="Excludes cancelled orders" /></Grid>
          </Grid>

          <Card>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Geofence</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyOrders.map((order: Order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.geofence?.firm_name ?? '—'}</TableCell>
                      <TableCell><Chip size="small" label={order.status} color={statusColor(order.status)} /></TableCell>
                      <TableCell align="right">{order.items?.length ?? 0}</TableCell>
                      <TableCell align="right">{formatAmount(order.total)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && dailyOrders.length === 0 && (
                    <TableRow><TableCell colSpan={6} align="center">No orders found for this date.</TableCell></TableRow>
                  )}
                  {isLoading && <TableRow><TableCell colSpan={6} align="center">Loading orders...</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            {data && data.data.total > data.data.data.length && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Showing the first {data.data.data.length} of {data.data.total} orders. The summary may be incomplete if the company has more than 1,000 orders.
                </Typography>
              </Box>
            )}
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
