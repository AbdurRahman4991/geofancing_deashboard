import { useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useExportAttendanceReportMutation,
  useGetAttendanceReportQuery,
  type AttendanceReportStatus,
} from '../../../redux/service/attendanceReportService';
import type { MarketVisitReportPeriod } from '../../../redux/service/marketVisitReportService';
import { ReportExportButtons } from './report-export-buttons';
import { ReportFilters } from './report-filters';

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Card>
  );
}

export default function EmployeeAttendanceSummary() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [period, setPeriod] = useState<MarketVisitReportPeriod>('daily');
  const [hierarchyLevelId, setHierarchyLevelId] = useState('');
  const [hierarchyNodeId, setHierarchyNodeId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 15;
  const [exportAttendanceReport, { isLoading: isExporting }] = useExportAttendanceReportMutation();

  const reportFilters = {
    period,
    from_date: selectedDate,
    to_date: selectedDate,
    ...(hierarchyLevelId ? { hierarchy_level_id: Number(hierarchyLevelId) } : {}),
    ...(hierarchyNodeId ? { hierarchy_node_id: Number(hierarchyNodeId) } : {}),
    ...(userId ? { user_id: Number(userId) } : {}),
    ...(status ? { status: status as AttendanceReportStatus } : {}),
  };
  const params = {
    ...reportFilters,
    page: page + 1,
    per_page: perPage,
  };
  const { data, isLoading, isFetching, isError } = useGetAttendanceReportQuery(params);
  const rows = data?.data ?? [];
  const summary = data?.summary;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const file = await exportAttendanceReport({
        ...reportFilters,
        export: format,
      }).unwrap();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `attendance-report-${selectedDate}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Could not export the attendance report.', error);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Attendance Summary
          </Typography>
          <ReportExportButtons
            disabled={isExporting}
            onExcel={() => handleExport('excel')}
            onPdf={() => handleExport('pdf')}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          <ReportFilters
            date={selectedDate}
            period={period}
            hierarchyLevelId={hierarchyLevelId}
            hierarchyNodeId={hierarchyNodeId}
            userId={userId}
            visitStatus="all"
            onDateChange={setSelectedDate}
            onPeriodChange={setPeriod}
            onHierarchyLevelChange={setHierarchyLevelId}
            onHierarchyNodeChange={setHierarchyNodeId}
            onUserChange={setUserId}
            onVisitStatusChange={() => undefined}
            onFilterChange={() => setPage(0)}
            showVisitStatus={false}
            idPrefix="attendance-report"
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="attendance-status-label">Status</InputLabel>
            <Select
              labelId="attendance-status-label"
              value={status}
              label="Status"
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="checked_in">Checked in</MenuItem>
              <MenuItem value="checked_out">Checked out</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="leave">Leave</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {isError ? (
        <Typography color="error">Could not load attendance report.</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Total attendance"
                value={isLoading ? '—' : (summary?.total_attendance ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Checked in"
                value={isLoading ? '—' : (summary?.checked_in ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Checked out"
                value={isLoading ? '—' : (summary?.checked_out ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard title="Absent" value={isLoading ? '—' : (summary?.absent ?? 0)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard title="Leave" value={isLoading ? '—' : (summary?.leave_count ?? 0)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Late arrivals"
                value={isLoading ? '—' : (summary?.late_count ?? 0)}
              />
            </Grid>
          </Grid>

          <Card>
            <TableContainer>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Check in</TableCell>
                    <TableCell>Check out</TableCell>
                    <TableCell>Work hours</TableCell>
                    <TableCell>Late</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Hierarchy</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.employee_name ?? '—'}</TableCell>
                      <TableCell>{row.check_in_date}</TableCell>
                      <TableCell>{formatDateTime(row.check_in_time)}</TableCell>
                      <TableCell>{formatDateTime(row.check_out_time)}</TableCell>
                      <TableCell>{row.work_hour ?? '—'}</TableCell>
                      <TableCell>{row.late ?? '—'}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        {[row.hierarchy_level_name, row.hierarchy_node_name]
                          .filter(Boolean)
                          .join(' / ') || '—'}
                      </TableCell>
                      <TableCell>{row.remarks ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No attendance found for this period.
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Loading attendance...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.pagination.total ?? 0}
              page={page}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              rowsPerPage={perPage}
              rowsPerPageOptions={[perPage]}
            />
            {isFetching && !isLoading && (
              <Typography sx={{ px: 2, pb: 1 }} variant="caption" color="text.secondary">
                Updating report…
              </Typography>
            )}
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
