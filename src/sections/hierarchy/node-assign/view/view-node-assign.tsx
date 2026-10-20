import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

import { useGetEmployeeHierarchyAssignmentsQuery } from '../../../../../redux/service/employeeHierarchyAssignmentSlice';
import { useRouter } from 'src/routes/hooks';

const DEFAULT_ROWS_PER_PAGE = 15;

export function ViewNodeAssign() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('user');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const { data, isLoading, isError } = useGetEmployeeHierarchyAssignmentsQuery({
    page: page + 1,
    per_page: rowsPerPage,
    search: filterName || undefined,
  });

  const assignments = data?.data?.data ?? [];
  const search = filterName.trim().toLowerCase();
  const filteredAssignments = assignments.filter((assignment) =>
    [
      assignment.user ?? '',
      assignment.company ?? '',
      assignment.hierarchy_node ?? '',
      assignment.hierarchy_level ?? '',
      assignment.hierarchy_level_code ?? '',
      assignment.assigned_by ?? '',
      String(assignment.id),
    ].some((value) => value.toLowerCase().includes(search))
  );
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const left = String(a[orderBy as keyof typeof a] ?? '');
    const right = String(b[orderBy as keyof typeof b] ?? '');
    const comparison = left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });

  const visibleSelectedCount = sortedAssignments.filter((assignment) =>
    selected.includes(String(assignment.id))
  ).length;

  const handleSelectRow = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const handleSelectAllRows = (checked: boolean) => {
    const visibleIds = sortedAssignments.map((assignment) => String(assignment.id));
    setSelected((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((id) => !visibleIds.includes(id))
    );
  };

  const handleSort = (id: string) => {
    setOrder((current) => orderBy === id && current === 'asc' ? 'desc' : 'asc');
    setOrderBy(id);
  };

  if (isLoading) {
    return <DashboardContent><Typography>Loading employee hierarchy assignments...</Typography></DashboardContent>;
  }

  if (isError) {
    return <DashboardContent><Typography color="error">Failed to load employee hierarchy assignments.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Employee Hierarchy Assignments</Typography>
        <Button
          onClick={() => router.push('/create/assign-node')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Assignment
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 1400 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sortedAssignments.length}
                numSelected={visibleSelectedCount}
                onSort={handleSort}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'id', label: 'Assignment ID' },
                  { id: 'user', label: 'Employee' },
                  { id: 'company_id', label: 'Company ID' },
                  { id: 'company', label: 'Company' },
                  { id: 'hierarchy_node_id', label: 'Node ID' },
                  { id: 'hierarchy_node', label: 'Hierarchy Node' },
                  { id: 'hierarchy_level', label: 'Hierarchy Level' },
                  { id: 'hierarchy_level_code', label: 'Level Code' },
                  { id: 'is_current', label: 'Current' },
                  { id: 'assigned_by', label: 'Assigned By' },
                  { id: '', label: 'Action' },
                ]}
              />

              <TableBody>
                {sortedAssignments.map((assignment) => (
                  <UserTableRow
                    key={assignment.id}
                    row={assignment}
                    selected={selected.includes(String(assignment.id))}
                    onSelectRow={() => handleSelectRow(String(assignment.id))}
                  />
                ))}
                {!sortedAssignments.length && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={data?.data?.total ?? 0}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[15, 30, 50]}
        />
      </Card>
    </DashboardContent>
  );
}

export default ViewNodeAssign;
