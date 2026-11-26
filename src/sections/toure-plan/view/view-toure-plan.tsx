import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useGetTourPlansQuery } from '../../../../redux/service/tourPlanService';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';

export function TourPlanView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const rowsPerPage = 15;
  const router = useRouter();
  const { data, isLoading, isError } = useGetTourPlansQuery({ page: page + 1, per_page: rowsPerPage });
  const plans = data?.data ?? [];
  const search = filterName.trim().toLowerCase();
  const filteredPlans = plans.filter((plan) =>
    [plan.employee?.name ?? '', String(plan.user_id), plan.plan_date, plan.status, plan.notes ?? '',
      ...(plan.stops ?? []).map((stop) => stop.geofence?.firm_name ?? '')]
      .some((value) => value.toLowerCase().includes(search))
  );

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>

        <Typography variant="h4" sx={{ flexGrow: 1 }} > Tour plane </Typography>
        <Button onClick={() => router.push('/create/tour-plan')} variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          New Tour Plan
        </Button>
      </Box>
      <Card>
        <UserTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead><TableRow>
              <TableCell>Employee</TableCell><TableCell>Plan date</TableCell><TableCell>Stops</TableCell><TableCell>Notes</TableCell><TableCell>Status</TableCell><TableCell align="right">Action</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filteredPlans.map((plan) => <UserTableRow key={plan.id} row={plan} />)}
              {!filteredPlans.length && !isLoading && !isError && <TableNoData searchQuery={filterName} colSpan={6} />}
              {isError && <TableRow><TableCell colSpan={6}>Unable to load tour plans. Please try again.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" page={page} count={data?.total ?? 0} rowsPerPage={rowsPerPage}
          onPageChange={(_, nextPage) => setPage(nextPage)} rowsPerPageOptions={[rowsPerPage]} />
      </Card>
    </DashboardContent>
  );
}

export default TourPlanView;
