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
import { useGetAttendanceHistoryQuery, type Attendance } from '../../../redux/service/attendanceHistory';

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const localDate = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatTime = (value: string | null) => value
  ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  : '—';

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return <Card sx={{ p: 3, height: '100%' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
  </Card>;
}

export default function EmployeeVisitReport() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [search, setSearch] = useState('');
  const date = new Date(`${selectedDate}T00:00:00`);
  const { data, isLoading, isError } = useGetAttendanceHistoryQuery({
    page: 1,
    per_page: 1000,
    year: date.getFullYear(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    search: search || undefined,
  });
  const visits = useMemo(() => (data?.data ?? []).filter((row) =>
    localDate(row.check_in_time || row.created_at) === selectedDate
  ), [data, selectedDate]);
  const summary = useMemo(() => ({
    visits: visits.length,
    employees: new Set(visits.map((row) => row.user_id)).size,
    locations: new Set(visits.map((row) => row.geofence_id).filter((id) => id !== null)).size,
    completed: visits.filter((row) => Boolean(row.check_out_time)).length,
  }), [visits]);

  return <DashboardContent>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>Employee Visit Report</Typography>
      <ReportExportButtons />
      <TextField label="Report date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} InputLabelProps={{ shrink: true }} size="small" />
      <TextField label="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} size="small" />
    </Stack>

    {isError ? <Typography color="error">Could not load employee visits for this report.</Typography> : <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total visits" value={isLoading ? '—' : summary.visits} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Employees" value={isLoading ? '—' : summary.employees} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Firms visited" value={isLoading ? '—' : summary.locations} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Completed visits" value={isLoading ? '—' : summary.completed} /></Grid>
      </Grid>
      <Card><TableContainer>
        <Table sx={{ minWidth: 950 }}>
          <TableHead><TableRow>
            <TableCell>Employee</TableCell><TableCell>Employee ID</TableCell><TableCell>Firm / Geofence</TableCell>
            <TableCell>Check In</TableCell><TableCell>Check Out</TableCell><TableCell>Duration</TableCell>
            <TableCell>Status</TableCell><TableCell>Remarks</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {visits.map((row: Attendance) => <TableRow key={row.id} hover>
              <TableCell>{row.user?.name ?? '—'}</TableCell><TableCell>{row.user?.employee_id ?? '—'}</TableCell>
              <TableCell>{row.geofence?.firm_name ?? (row.geofence_id ? `Geofence #${row.geofence_id}` : '—')}</TableCell>
              <TableCell>{formatTime(row.check_in_time)}</TableCell><TableCell>{formatTime(row.check_out_time)}</TableCell>
              <TableCell>{row.work_hour || '—'}</TableCell><TableCell>{row.status || '—'}</TableCell><TableCell>{row.remarks || '—'}</TableCell>
            </TableRow>)}
            {!isLoading && visits.length === 0 && <TableRow><TableCell colSpan={8} align="center">No visits found for this date.</TableCell></TableRow>}
            {isLoading && <TableRow><TableCell colSpan={8} align="center">Loading visits...</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      {data && data.pagination.total > data.data.length && <Typography sx={{ px: 2, py: 1 }} variant="caption" color="text.secondary">
        Showing the first {data.data.length} records. This report may be incomplete when more than 1,000 records match.
      </Typography>}</Card>
    </>}
  </DashboardContent>;
}
