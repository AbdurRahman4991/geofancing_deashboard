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

function SummaryCard({ title, value, helper }: { title: string; value: string | number; helper?: string }) {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
      {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
    </Card>
  );
}

const statusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  const normalized = status.toLowerCase();
  if (normalized.includes('present') || normalized === 'checked_in' || normalized === 'on_time') return 'success';
  if (normalized.includes('late')) return 'warning';
  if (normalized.includes('absent')) return 'error';
  return 'default';
};

const formatTime = (value: string | null) => value
  ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  : '—';

export default function DailyAttendanceReport() {
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

  const records = useMemo(() => (data?.data ?? []).filter((row) =>
    localDate(row.check_in_time || row.created_at) === selectedDate
  ), [data, selectedDate]);
  const summary = useMemo(() => ({
    total: records.length,
    present: records.filter((row) => !row.status.toLowerCase().includes('absent')).length,
    late: records.filter((row) => row.late && row.late !== '0' && row.late.toLowerCase() !== 'no').length,
    checkedOut: records.filter((row) => Boolean(row.check_out_time)).length,
  }), [records]);

  return (
    <DashboardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Daily Attendance Report</Typography>
        <ReportExportButtons />
        <TextField label="Report date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} InputLabelProps={{ shrink: true }} size="small" />
        <TextField label="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} size="small" />
      </Stack>

      {isError ? <Typography color="error">Could not load attendance for this report.</Typography> : <>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}><SummaryCard title="Attendance records" value={isLoading ? '—' : summary.total} /></Grid>
          <Grid item xs={12} sm={6} md={3}><SummaryCard title="Present" value={isLoading ? '—' : summary.present} /></Grid>
          <Grid item xs={12} sm={6} md={3}><SummaryCard title="Late arrivals" value={isLoading ? '—' : summary.late} /></Grid>
          <Grid item xs={12} sm={6} md={3}><SummaryCard title="Checked out" value={isLoading ? '—' : summary.checkedOut} /></Grid>
        </Grid>

        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead><TableRow>
                <TableCell>Employee</TableCell><TableCell>Employee ID</TableCell><TableCell>Geofence / Firm</TableCell>
                <TableCell>Check In</TableCell><TableCell>Check Out</TableCell><TableCell>Work Hours</TableCell>
                <TableCell>Status</TableCell><TableCell>Late</TableCell><TableCell>Remarks</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {records.map((row: Attendance) => <TableRow key={row.id} hover>
                  <TableCell>{row.user?.name ?? '—'}</TableCell><TableCell>{row.user?.employee_id ?? '—'}</TableCell>
                  <TableCell>{row.geofence?.firm_name ?? '—'}</TableCell><TableCell>{formatTime(row.check_in_time)}</TableCell>
                  <TableCell>{formatTime(row.check_out_time)}</TableCell><TableCell>{row.work_hour ?? '—'}</TableCell>
                  <TableCell><Chip size="small" label={row.status || 'Unknown'} color={statusColor(row.status || '')} /></TableCell>
                  <TableCell>{row.late || '—'}</TableCell><TableCell>{row.remarks || '—'}</TableCell>
                </TableRow>)}
                {!isLoading && records.length === 0 && <TableRow><TableCell colSpan={9} align="center">No attendance found for this date.</TableCell></TableRow>}
                {isLoading && <TableRow><TableCell colSpan={9} align="center">Loading attendance...</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          {data && data.pagination.total > data.data.length && <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">Showing the first {data.data.length} records. The report may be incomplete when more than 1,000 attendance records match.</Typography>
          </Box>}
        </Card>
      </>}
    </DashboardContent>
  );
}
