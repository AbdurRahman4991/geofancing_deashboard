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
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useGetTourPlansQuery } from '../../../../redux/service/tourPlanService';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';

export function TourPlanView() {
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;
  const router = useRouter();
  const { data, isLoading, isError } = useGetTourPlansQuery({ page: page + 1, per_page: rowsPerPage });
  const plans = data?.data ?? [];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        {/* <Typography variant="h4" sx={{ flexGrow: 1 }}>Tour Plans</Typography> */}
        <Button onClick={() => router.push('/create/tour-plan')} variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          {/* New Tour Plan */}
        </Button>
      </Box>
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead><TableRow>
              <TableCell>Employee</TableCell><TableCell>Plan date</TableCell><TableCell>Stops</TableCell><TableCell>Notes</TableCell><TableCell>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {plans.map((plan) => <UserTableRow key={plan.id} row={plan} />)}
              {!plans.length && !isLoading && <TableNoData searchQuery="" colSpan={5} />}
              {isError && <TableRow><TableCell colSpan={5}>Unable to load tour plans. Please try again.</TableCell></TableRow>}
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
