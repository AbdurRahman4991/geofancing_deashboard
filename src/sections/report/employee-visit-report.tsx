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
import {
  useExportMarketVisitReportMutation,
  useGetMarketVisitReportQuery,
  type MarketVisitReportPeriod,
  type MarketVisitStatus,
} from '../../../redux/service/marketVisitReportService';
import { ReportFilters } from './report-filters';
import { ReportExportButtons } from './report-export-buttons';
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
      {' '}
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>{' '}
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>{' '}
    </Card>
  );
}
export default function EmployeeVisitReport() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [period, setPeriod] = useState<MarketVisitReportPeriod>('daily');
  const [visitStatus, setVisitStatus] = useState<MarketVisitStatus>('all');
  const [hierarchyLevelId, setHierarchyLevelId] = useState('');
  const [hierarchyNodeId, setHierarchyNodeId] = useState('');
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 20;
  const [exportMarketVisitReport, { isLoading: isExporting }] =
    useExportMarketVisitReportMutation();
  const { data, isLoading, isFetching, isError } = useGetMarketVisitReportQuery({
    period,
    from_date: selectedDate,
    to_date: selectedDate,
    ...(hierarchyLevelId ? { hierarchy_level_id: Number(hierarchyLevelId) } : {}),
    ...(hierarchyNodeId ? { hierarchy_node_id: Number(hierarchyNodeId) } : {}),
    ...(userId ? { user_id: Number(userId) } : {}),
    visit_status: visitStatus,
    page: page + 1,
    per_page: perPage,
  });
  const rows = data?.data.data ?? [];
  const summary = data?.summary;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const file = await exportMarketVisitReport({
        export: format,
        period,
        from_date: selectedDate,
        to_date: selectedDate,
        ...(hierarchyLevelId ? { hierarchy_level_id: Number(hierarchyLevelId) } : {}),
        ...(hierarchyNodeId ? { hierarchy_node_id: Number(hierarchyNodeId) } : {}),
        ...(userId ? { user_id: Number(userId) } : {}),
        visit_status: visitStatus,
      }).unwrap();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `market-visit-report-${selectedDate}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Could not export the market visit report.', error);
    }
  };
  return (
    <DashboardContent>
      {' '}
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Market Visit Report
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
          visitStatus={visitStatus}
          onDateChange={setSelectedDate}
          onPeriodChange={setPeriod}
          onHierarchyLevelChange={setHierarchyLevelId}
          onHierarchyNodeChange={setHierarchyNodeId}
          onUserChange={setUserId}
          onVisitStatusChange={setVisitStatus}
          onFilterChange={() => setPage(0)}
        />
      </Stack>
      {isError ? (
        <Typography color="error">Could not load the market visit report.</Typography>
      ) : (
        <>
          {' '}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {' '}
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total visits"
                value={isLoading ? '—' : (summary?.total_visits ?? 0)}
              />
            </Grid>{' '}
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Employees"
                value={isLoading ? '—' : (summary?.total_employees ?? 0)}
              />
            </Grid>{' '}
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Markets visited"
                value={
                  isLoading
                    ? '—'
                    : `${summary?.visited_markets ?? 0} / ${summary?.total_markets ?? 0}`
                }
              />
            </Grid>{' '}
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Completed visits"
                value={isLoading ? '—' : (summary?.completed_visits ?? 0)}
              />
            </Grid>{' '}
          </Grid>{' '}
          <Card>
            {' '}
            <TableContainer>
              {' '}
              <Table sx={{ minWidth: 1050 }}>
                {' '}
                <TableHead>
                  <TableRow>
                    {' '}
                    <TableCell>Employee</TableCell> <TableCell>Market</TableCell>{' '}
                    <TableCell>Address</TableCell> <TableCell>Hierarchy</TableCell>{' '}
                    <TableCell>Visit Start</TableCell> <TableCell>Visit End</TableCell>{' '}
                    <TableCell>Duration</TableCell> <TableCell>Status</TableCell>{' '}
                  </TableRow>
                </TableHead>{' '}
                <TableBody>
                  {' '}
                  {rows.map((row) => (
                    <TableRow key={`${row.geofence_id}-${row.visit_id ?? 'none'}`} hover>
                      {' '}
                      <TableCell>{row.employee_name ?? '—'}</TableCell>{' '}
                      <TableCell>{row.market_name}</TableCell>{' '}
                      <TableCell>{row.market_address ?? '—'}</TableCell>{' '}
                      <TableCell>
                        {[row.hierarchy_level, row.hierarchy_node].filter(Boolean).join(' / ') ||
                          '—'}
                      </TableCell>{' '}
                      <TableCell>{formatDateTime(row.visit_start_time)}</TableCell>{' '}
                      <TableCell>{formatDateTime(row.visit_end_time)}</TableCell>{' '}
                      <TableCell>{row.duration ?? '—'}</TableCell>{' '}
                      <TableCell>
                        {row.visit_id === null
                          ? 'Not visited'
                          : row.visit_end_time
                            ? 'Completed'
                            : 'Active'}
                      </TableCell>{' '}
                    </TableRow>
                  ))}{' '}
                  {!isLoading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No markets found for this date.
                      </TableCell>
                    </TableRow>
                  )}{' '}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Loading market visits...
                      </TableCell>
                    </TableRow>
                  )}{' '}
                </TableBody>{' '}
              </Table>{' '}
            </TableContainer>{' '}
            <TablePagination
              component="div"
              count={data?.data.total ?? 0}
              page={page}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              rowsPerPage={perPage}
              rowsPerPageOptions={[perPage]}
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
            />{' '}
            {isFetching && !isLoading && (
              <Typography sx={{ px: 2, pb: 1 }} variant="caption" color="text.secondary">
                Updating report…
              </Typography>
            )}{' '}
          </Card>{' '}
        </>
      )}{' '}
    </DashboardContent>
  );
}
