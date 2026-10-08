import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { useRouter } from 'src/routes/hooks';
import { useGetDepartmentsQuery } from '../../../../redux/service/departmentsSlice';

export function DepartmentView() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  const { data, isLoading, isError } = useGetDepartmentsQuery({
    page,
    per_page: rowsPerPage,
    search: filterName || undefined,
  });
  const departments = data?.data.data ?? [];
  const pagination = data?.data;

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage + 1);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Departments</Typography>
        <Button onClick={() => router.push('/department/create-department')} variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          New department
        </Button>
      </Box>
      <Card>
        <UserTableToolbar numSelected={0} filterName={filterName} onFilterName={(event) => { setFilterName(event.target.value); setPage(1); }} />
        {isLoading ? <Typography sx={{ p: 3 }}>Loading departments...</Typography> : isError ? (
          <Typography sx={{ p: 3, color: 'error.main' }}>Failed to load departments.</Typography>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 650 }}>
                  <UserTableHead order="asc" orderBy="name" rowCount={departments.length} numSelected={0} onSort={() => {}} onSelectAllRows={() => {}}
                    headLabel={[{ id: 'name', label: 'Department' }, { id: 'company', label: 'Company' }, { id: 'description', label: 'Description' }, { id: 'status', label: 'Status' }, { id: '' }]} />
                  <TableBody>
                    {departments.map((department) => <UserTableRow key={department.id} row={department} selected={false} onSelectRow={() => {}} />)}
                    {!departments.length && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <TablePagination component="div" page={(pagination?.current_page ?? 1) - 1} count={pagination?.total ?? 0} rowsPerPage={pagination?.per_page ?? rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25]} />
          </>
        )}
      </Card>
    </DashboardContent>
  );
}
