import { useState } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import {
  useExportEmployeeReportMutation,
  useGetEmployeeReportQuery,
  type EmployeeRegistrationFilter,
  type EmployeeStatusFilter,
} from '../../../redux/service/employeeReportService';
import { ReportExportButtons } from './report-export-buttons';

const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const statusColor = (status: string): 'success' | 'warning' | 'default' =>
  status.toLowerCase() === 'registered' ? 'success' : 'warning';

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

export default function EmployeeReport() {
  const companyId = getCurrentCompanyId();
  const [registrationStatus, setRegistrationStatus] = useState<EmployeeRegistrationFilter>('both');
  const [employeeStatus, setEmployeeStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 20;
  const [exportEmployeeReport, { isLoading: isExporting }] = useExportEmployeeReportMutation();
  const reportFilters = {
    company_id: companyId,
    registration_status: registrationStatus,
    ...(employeeStatus ? { employee_status: employeeStatus as EmployeeStatusFilter } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  };
  const { data, isLoading, isFetching, isError } = useGetEmployeeReportQuery(
    {
      ...reportFilters,
      page: page + 1,
      per_page: perPage,
    },
    { skip: !companyId }
  );
  const employees = data?.data.data ?? [];
  const summary = data?.summary;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const file = await exportEmployeeReport({ ...reportFilters, export: format }).unwrap();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `employee-registration-report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Could not export the employee report.', error);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">Employee Registration Report</Typography>
          <ReportExportButtons
            disabled={isExporting || !companyId}
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
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="registration-status-label">Registration status</InputLabel>
            <Select
              labelId="registration-status-label"
              value={registrationStatus}
              label="Registration status"
              onChange={(event) => {
                setRegistrationStatus(event.target.value as EmployeeRegistrationFilter);
                setPage(0);
              }}
            >
              <MenuItem value="both">All employees</MenuItem>
              <MenuItem value="registered">Registered</MenuItem>
              <MenuItem value="unregistered">Unregistered</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="employee-status-label">Employee status</InputLabel>
            <Select
              labelId="employee-status-label"
              value={employeeStatus}
              label="Employee status"
              onChange={(event) => {
                setEmployeeStatus(event.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search employee"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            size="small"
          />
        </Stack>
      </Stack>

      {!companyId ? (
        <Typography color="warning.main">
          No company is associated with the current account.
        </Typography>
      ) : isError ? (
        <Typography color="error">Could not load the employee registration report.</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total employees"
                value={isLoading ? '—' : (summary?.total_employees ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Registered"
                value={isLoading ? '—' : (summary?.registered_employees ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Unregistered"
                value={isLoading ? '—' : (summary?.unregistered_employees ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Registration rate"
                value={isLoading ? '—' : `${summary?.registration_rate ?? 0}%`}
              />
            </Grid>
          </Grid>

          <Card>
            <TableContainer>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Employee status</TableCell>
                    <TableCell>Registration</TableCell>
                    <TableCell>User status</TableCell>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Registered at</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>{employee.employee_name}</TableCell>
                      <TableCell>{employee.employee_id}</TableCell>
                      <TableCell>{employee.phone ?? '—'}</TableCell>
                      <TableCell>{employee.email ?? '—'}</TableCell>
                      <TableCell>{employee.company_name}</TableCell>
                      <TableCell>{employee.employee_status}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={employee.registration_status}
                          color={statusColor(employee.registration_status)}
                        />
                      </TableCell>
                      <TableCell>{employee.user_status ?? '—'}</TableCell>
                      <TableCell>{employee.device_id ?? '—'}</TableCell>
                      <TableCell>{formatDateTime(employee.registered_at)}</TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No employees match these filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Loading employee report...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.data.total ?? 0}
              page={page}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              rowsPerPage={perPage}
              rowsPerPageOptions={[perPage]}
            />
            {isFetching && !isLoading && (
              <Typography sx={{ px: 2, pb: 1 }} variant="caption" color="text.secondary">
                Updating employee report…
              </Typography>
            )}
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
