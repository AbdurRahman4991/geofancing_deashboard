import { useState } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
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
import type { MarketVisitReportPeriod } from '../../../redux/service/marketVisitReportService';
import {
  useExportMonthlyPerformanceReportMutation,
  useGetMonthlyPerformanceReportQuery,
} from '../../../redux/service/monthlyPerformanceReportService';
import { ReportExportButtons } from './report-export-buttons';
import { ReportFilters } from './report-filters';

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getPeriodRange = (anchorDate: string, period: MarketVisitReportPeriod) => {
  const anchor = new Date(`${anchorDate}T00:00:00`);
  if (period === 'daily') return { from_date: anchorDate, to_date: anchorDate };
  if (period === 'weekly') {
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from_date: formatDate(start), to_date: formatDate(end) };
  }
  if (period === 'monthly') {
    return {
      from_date: formatDate(new Date(anchor.getFullYear(), anchor.getMonth(), 1)),
      to_date: formatDate(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)),
    };
  }
  return {
    from_date: formatDate(new Date(anchor.getFullYear(), 0, 1)),
    to_date: formatDate(new Date(anchor.getFullYear(), 11, 31)),
  };
};

const money = (value: number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

export default function MonthlyPerformanceReport() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [period, setPeriod] = useState<MarketVisitReportPeriod>('monthly');
  const [hierarchyLevelId, setHierarchyLevelId] = useState('');
  const [hierarchyNodeId, setHierarchyNodeId] = useState('');
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 10;
  const [exportReport, { isLoading: isExporting }] = useExportMonthlyPerformanceReportMutation();
  const dateRange = getPeriodRange(selectedDate, period);
  const reportFilters = {
    period,
    ...dateRange,
    ...(hierarchyLevelId ? { hierarchy_level_id: Number(hierarchyLevelId) } : {}),
    ...(hierarchyNodeId ? { hierarchy_node_id: Number(hierarchyNodeId) } : {}),
    ...(userId ? { user_id: Number(userId) } : {}),
  };
  const { data, isLoading, isFetching, isError } = useGetMonthlyPerformanceReportQuery({
    ...reportFilters,
    page: page + 1,
    per_page: perPage,
  });
  const employees = data?.data ?? [];
  const summary = data?.summary;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const file = await exportReport({ ...reportFilters, export: format }).unwrap();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `monthly-performance-${dateRange.from_date}-to-${dateRange.to_date}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Could not export the monthly performance report.', error);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Monthly Performance Report
          </Typography>
          <ReportExportButtons
            disabled={isExporting}
            onExcel={() => handleExport('excel')}
            onPdf={() => handleExport('pdf')}
          />
        </Stack>
        <ReportFilters
          date={selectedDate}
          period={period}
          hierarchyLevelId={hierarchyLevelId}
          hierarchyNodeId={hierarchyNodeId}
          userId={userId}
          visitStatus="all"
          onDateChange={(value) => {
            setSelectedDate(value);
            setPage(0);
          }}
          onPeriodChange={(value) => {
            setPeriod(value);
            setPage(0);
          }}
          onHierarchyLevelChange={setHierarchyLevelId}
          onHierarchyNodeChange={setHierarchyNodeId}
          onUserChange={setUserId}
          onVisitStatusChange={() => undefined}
          onFilterChange={() => setPage(0)}
          showVisitStatus={false}
          dateLabel="Period date"
          idPrefix="monthly-performance"
        />
      </Stack>

      {isError ? (
        <Typography color="error">Could not load monthly performance data.</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Employees"
                value={isLoading ? '—' : (summary?.total_employees ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Present days"
                value={isLoading ? '—' : (summary?.total_present_days ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Absent days"
                value={isLoading ? '—' : (summary?.total_absent_days ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Late days"
                value={isLoading ? '—' : (summary?.total_late_days ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Market visits"
                value={isLoading ? '—' : (summary?.total_market_visits ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard title="Orders" value={isLoading ? '—' : (summary?.total_orders ?? 0)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SummaryCard
                title="Sales"
                value={isLoading ? '—' : money(summary?.total_sales ?? 0)}
              />
            </Grid>
          </Grid>

          <Card>
            <TableContainer>
              <Table sx={{ minWidth: 1450 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell align="right">Present / Working</TableCell>
                    <TableCell align="right">Absent</TableCell>
                    <TableCell align="right">Late</TableCell>
                    <TableCell align="right">Attendance rate</TableCell>
                    <TableCell align="right">Visits</TableCell>
                    <TableCell align="right">Completed visits</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Sales</TableCell>
                    <TableCell align="right">Sales target %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.user_id} hover>
                      <TableCell>{employee.employee_name}</TableCell>
                      <TableCell>{employee.employee_id}</TableCell>
                      <TableCell align="right">
                        {employee.attendance.present_days} / {employee.attendance.working_days}
                      </TableCell>
                      <TableCell align="right">{employee.attendance.absent_days}</TableCell>
                      <TableCell align="right">{employee.attendance.late_days}</TableCell>
                      <TableCell align="right">{employee.attendance.attendance_rate}%</TableCell>
                      <TableCell align="right">{employee.field_visits.total_visits}</TableCell>
                      <TableCell align="right">{employee.field_visits.completed_visits}</TableCell>
                      <TableCell align="right">{employee.working_hours.total_hours}</TableCell>
                      <TableCell align="right">{employee.sales.total_orders}</TableCell>
                      <TableCell align="right">{money(employee.sales.total_sales)}</TableCell>
                      <TableCell align="right">
                        {employee.target_achievement.achievement_percentage ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        No performance data found for this period.
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        Loading performance data...
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
