import { useMemo, useState } from 'react';

import Card from '@mui/material/Card';
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
import { ReportExportButtons } from './report-export-buttons';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetAttendanceHistoryQuery } from '../../../redux/service/attendanceHistory';
import { useGetOrdersQuery, type Order } from '../../../redux/service/orderSlice';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const localMonth = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const money = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function SummaryCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return <Card sx={{ p: 3, height: '100%' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
    {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
  </Card>;
}

export default function MonthlyPerformanceReport() {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [search, setSearch] = useState('');
  const companyId = getCurrentCompanyId();
  const { data: orderResponse, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery(
    { company_id: companyId || '', page: 1, per_page: 1000 },
    { skip: !companyId }
  );
  const { data: attendanceResponse, isLoading: attendanceLoading, isError: attendanceError } = useGetAttendanceHistoryQuery({
    page: 1, per_page: 1000, year, month, search: search || undefined,
  });
  const monthKey = `${year}-${month}`;
  const orders = useMemo(() => (orderResponse?.data.data ?? []).filter((order) => localMonth(order.created_at) === monthKey), [orderResponse, monthKey]);
  const attendances = attendanceResponse?.data ?? [];
  const performance = useMemo(() => {
    const employeeMap = new Map<string, { name: string; employeeId: string | number; attendanceDays: Set<string>; late: number; orders: number; sales: number }>();
    const getEmployee = (userId: number, name?: string | null, employeeId?: number | string | null) => {
      const key = String(userId);
      const row = employeeMap.get(key) ?? {
        name: name || `Employee #${userId}`, employeeId: employeeId ?? '—',
        attendanceDays: new Set<string>(), late: 0, orders: 0, sales: 0,
      };
      if (name) row.name = name;
      if (employeeId != null) row.employeeId = employeeId;
      employeeMap.set(key, row);
      return row;
    };
    attendances.forEach((record) => {
      const row = getEmployee(record.user_id, record.user?.name, record.user?.employee_id);
      row.attendanceDays.add((record.check_in_time || record.created_at).slice(0, 10));
      if (record.late && record.late !== '0' && record.late.toLowerCase() !== 'no') row.late += 1;
    });
    orders.forEach((order: Order) => {
      const row = getEmployee(order.created_by);
      row.orders += 1;
      if (order.status.toLowerCase() !== 'cancelled') row.sales += Number(order.total || 0);
    });
    return Array.from(employeeMap.entries()).map(([id, row]) => ({
      id, ...row, attendanceDays: row.attendanceDays.size,
    })).sort((a, b) => b.sales - a.sales || b.orders - a.orders || a.name.localeCompare(b.name));
  }, [attendances, orders]);

  const summary = useMemo(() => ({
    orders: orders.length,
    sales: orders.filter((order) => order.status.toLowerCase() !== 'cancelled').reduce((sum, order) => sum + Number(order.total || 0), 0),
    employees: performance.length,
    attendanceDays: performance.reduce((sum, employee) => sum + employee.attendanceDays, 0),
  }), [orders, performance]);
  const loading = ordersLoading || attendanceLoading;
  const isError = ordersError || attendanceError;

  return <DashboardContent>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>Monthly Performance Report</Typography>
      <ReportExportButtons />
      <TextField select label="Month" value={month} onChange={(event) => setMonth(event.target.value)} size="small" SelectProps={{ native: true }}>
        {MONTHS.map((label, index) => <option key={label} value={String(index + 1).padStart(2, '0')}>{label}</option>)}
      </TextField>
      <TextField label="Year" type="number" value={year} onChange={(event) => setYear(event.target.value)} size="small" sx={{ width: 120 }} />
      <TextField label="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} size="small" />
    </Stack>

    {isError ? <Typography color="error">Could not load performance data for this report.</Typography> : <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Orders" value={loading ? '—' : summary.orders} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Net order value" value={loading ? '—' : money(summary.sales)} helper="Cancelled orders excluded" /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Active employees" value={loading ? '—' : summary.employees} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Attendance days" value={loading ? '—' : summary.attendanceDays} /></Grid>
      </Grid>
      <Card><TableContainer>
        <Table sx={{ minWidth: 850 }}>
          <TableHead><TableRow>
            <TableCell>Employee</TableCell><TableCell>Employee ID</TableCell><TableCell align="right">Attendance Days</TableCell>
            <TableCell align="right">Late Arrivals</TableCell><TableCell align="right">Orders</TableCell><TableCell align="right">Order Value</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {performance.map((employee) => <TableRow key={employee.id} hover>
              <TableCell>{employee.name}</TableCell><TableCell>{employee.employeeId}</TableCell>
              <TableCell align="right">{employee.attendanceDays}</TableCell><TableCell align="right">{employee.late}</TableCell>
              <TableCell align="right">{employee.orders}</TableCell><TableCell align="right">{money(employee.sales)}</TableCell>
            </TableRow>)}
            {!loading && performance.length === 0 && <TableRow><TableCell colSpan={6} align="center">No performance data found for this month.</TableCell></TableRow>}
            {loading && <TableRow><TableCell colSpan={6} align="center">Loading performance data...</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      {(orderResponse && orderResponse.data.total > orderResponse.data.data.length) || (attendanceResponse && attendanceResponse.pagination.total > attendanceResponse.data.length) ? <Typography sx={{ px: 2, py: 1 }} variant="caption" color="text.secondary">
        Showing up to 1,000 orders and 1,000 attendance records; the report may be incomplete if either limit is reached.
      </Typography> : null}</Card>
    </>}
  </DashboardContent>;
}
