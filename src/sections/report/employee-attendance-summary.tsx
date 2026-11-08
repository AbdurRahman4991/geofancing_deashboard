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
import { useGetAttendanceHistoryQuery } from '../../../redux/service/attendanceHistory';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return <Card sx={{ p: 3, height: '100%' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
  </Card>;
}

const isLate = (late: string | null) => Boolean(late && late !== '0' && late.toLowerCase() !== 'no');

const workHours = (value: string | null) => {
  if (!value) return 0;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const match = value.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  return match ? Number(match[1]) + Number(match[2]) / 60 + Number(match[3] || 0) / 3600 : 0;
};

export default function EmployeeAttendanceSummary() {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useGetAttendanceHistoryQuery({
    page: 1, per_page: 1000, year, month, search: search || undefined,
  });

  const employees = useMemo(() => {
    const grouped = new Map<string, {
      name: string; employeeId: string | number; attendanceDays: Set<string>;
      lateDays: number; checkouts: number; hours: number;
    }>();
    (data?.data ?? []).forEach((record) => {
      const user = record.user;
      const key = String(user?.id ?? record.user_id);
      const day = (record.check_in_time || record.created_at).slice(0, 10);
      const current = grouped.get(key) ?? {
        name: user?.name || 'Unnamed employee', employeeId: user?.employee_id ?? '—',
        attendanceDays: new Set<string>(), lateDays: 0, checkouts: 0, hours: 0,
      };
      current.attendanceDays.add(day);
      if (isLate(record.late)) current.lateDays += 1;
      if (record.check_out_time) current.checkouts += 1;
      current.hours += workHours(record.work_hour);
      grouped.set(key, current);
    });
    return Array.from(grouped.entries()).map(([id, employee]) => ({
      id, ...employee, attendanceDays: employee.attendanceDays.size,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const totals = useMemo(() => employees.reduce((result, employee) => ({
    employees: result.employees + 1,
    days: result.days + employee.attendanceDays,
    late: result.late + employee.lateDays,
    hours: result.hours + employee.hours,
  }), { employees: 0, days: 0, late: 0, hours: 0 }), [employees]);

  return <DashboardContent>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>Employee Attendance Summary</Typography>
      <ReportExportButtons />
      <TextField select label="Month" value={month} onChange={(event) => setMonth(event.target.value)} size="small" SelectProps={{ native: true }}>
        {MONTHS.map((label, index) => <option key={label} value={String(index + 1).padStart(2, '0')}>{label}</option>)}
      </TextField>
      <TextField label="Year" type="number" value={year} onChange={(event) => setYear(event.target.value)} size="small" sx={{ width: 120 }} />
      <TextField label="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} size="small" />
    </Stack>

    {isError ? <Typography color="error">Could not load attendance summary.</Typography> : <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Employees with attendance" value={isLoading ? '—' : totals.employees} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Attendance days" value={isLoading ? '—' : totals.days} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Late arrivals" value={isLoading ? '—' : totals.late} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total work hours" value={isLoading ? '—' : totals.hours.toFixed(1)} /></Grid>
      </Grid>
      <Card><TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead><TableRow>
            <TableCell>Employee</TableCell><TableCell>Employee ID</TableCell><TableCell align="right">Attendance Days</TableCell>
            <TableCell align="right">Late Arrivals</TableCell><TableCell align="right">Checkouts</TableCell><TableCell align="right">Work Hours</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {employees.map((employee) => <TableRow key={employee.id} hover>
              <TableCell>{employee.name}</TableCell><TableCell>{employee.employeeId}</TableCell>
              <TableCell align="right">{employee.attendanceDays}</TableCell><TableCell align="right">{employee.lateDays}</TableCell>
              <TableCell align="right">{employee.checkouts}</TableCell><TableCell align="right">{employee.hours.toFixed(1)}</TableCell>
            </TableRow>)}
            {!isLoading && employees.length === 0 && <TableRow><TableCell colSpan={6} align="center">No attendance found for this month.</TableCell></TableRow>}
            {isLoading && <TableRow><TableCell colSpan={6} align="center">Loading attendance...</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      {data && data.pagination.total > data.data.length && <Typography sx={{ px: 2, py: 1 }} variant="caption" color="text.secondary">
        Showing the first {data.data.length} records. This summary may be incomplete when more than 1,000 records match.
      </Typography>}</Card>
    </>}
  </DashboardContent>;
}
