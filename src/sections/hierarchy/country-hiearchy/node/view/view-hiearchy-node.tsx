import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetCompanyQuery } from '../../../../../../redux/service/companySlice';
import { useGetCountryHiearchyLevelsQuery } from '../../../../../../redux/service/countryHiearchyLevelService';
import { useGetCountryHiearchyNodesQuery } from '../../../../../../redux/service/countryHiearchyNodeService';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

const DEFAULT_ROWS_PER_PAGE = 15;

export function NodeView() {
  const currentCompanyId = getCurrentCompanyId();
  const [companySelection, setCompanySelection] = useState('');
  const companyId = currentCompanyId || Number(companySelection);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filterName, setFilterName] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [parentFilter, setParentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const { data: companyData, isLoading: loadingCompanies } = useGetCompanyQuery(
    { page: 1, limit: 100 }, { skip: Boolean(currentCompanyId) }
  );
  const companies = companyData?.data ?? [];
  const { data: levelData } = useGetCountryHiearchyLevelsQuery(
    { company_id: companyId, page: 1, per_page: 100 }, { skip: !companyId }
  );
  const { data, isLoading, isError } = useGetCountryHiearchyNodesQuery(
    {
      company_id: companyId,
      page: page + 1,
      per_page: rowsPerPage,
      search: filterName.trim() || undefined,
      hierarchy_level_id: levelFilter ? Number(levelFilter) : undefined,
      parent_id: parentFilter === 'root' ? '' : undefined,
      status: statusFilter === 'all' ? undefined : statusFilter as 'active' | 'inactive',
    },
    { skip: !companyId }
  );
  const levels = levelData?.data ?? [];
  const nodes = data?.data ?? [];
  const sortedNodes = [...nodes].sort((a, b) => {
    const left = orderBy === 'level' ? a.level?.name : orderBy === 'parent' ? a.parent?.name : a[orderBy as keyof typeof a];
    const right = orderBy === 'level' ? b.level?.name : orderBy === 'parent' ? b.parent?.name : b[orderBy as keyof typeof b];
    const comparison = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
  const visibleSelectedCount = sortedNodes.filter((node) => selected.includes(String(node.id))).length;
  const resetSelection = () => setSelected([]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Country Hierarchy Nodes</Typography>
        {!currentCompanyId && (
          <TextField select size="small" label="Company" value={companySelection} onChange={(event) => { setCompanySelection(event.target.value); setPage(0); resetSelection(); }} disabled={loadingCompanies} sx={{ minWidth: 200 }}>
            {companies.map((company) => <MenuItem key={company.id} value={String(company.id)}>{company.company_name}</MenuItem>)}
          </TextField>
        )}
        <Button onClick={() => router.push('/create/country-hiearchy-node')} variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />} disabled={!companyId}>
          New Country Node
        </Button>
      </Box>
      {!companyId && <Alert severity="info" sx={{ mb: 2 }}>Select a company to view its country hierarchy nodes.</Alert>}
      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load country hierarchy nodes.</Alert>}

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => { setFilterName(event.target.value); setPage(0); resetSelection(); }}
        />
        <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField select size="small" label="Level" value={levelFilter} onChange={(event) => { setLevelFilter(event.target.value); setPage(0); resetSelection(); }} sx={{ minWidth: 180 }}>
            <MenuItem value="">All levels</MenuItem>
            {levels.map((level) => <MenuItem key={level.id} value={String(level.id)}>{level.name}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Parent" value={parentFilter} onChange={(event) => { setParentFilter(event.target.value); setPage(0); resetSelection(); }} sx={{ minWidth: 150 }}>
            <MenuItem value="all">All nodes</MenuItem>
            <MenuItem value="root">Root nodes</MenuItem>
          </TextField>
          <TextField select size="small" label="Status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(0); resetSelection(); }} sx={{ minWidth: 150 }}>
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
        {isLoading && <LinearProgress />}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 1050 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sortedNodes.length}
                numSelected={visibleSelectedCount}
                onSort={(id) => { setOrder((current) => (orderBy === id && current === 'asc' ? 'desc' : 'asc')); setOrderBy(id); }}
                onSelectAllRows={(checked) => {
                  const visibleIds = sortedNodes.map((node) => String(node.id));
                  setSelected((current) => checked ? Array.from(new Set([...current, ...visibleIds])) : current.filter((id) => !visibleIds.includes(id)));
                }}
                headLabel={[
                  { id: 'name', label: 'Node Name' },
                  { id: 'code', label: 'Code' },
                  { id: 'level', label: 'Level' },
                  { id: 'parent', label: 'Parent' },
                  { id: 'status', label: 'Status' },
                  { id: 'latitude', label: 'Coordinates' },
                  { id: 'action', label: 'Action' },
                ]}
              />
              <TableBody>
                {sortedNodes.map((node) => (
                  <UserTableRow key={node.id} row={node} selected={selected.includes(String(node.id))} onSelectRow={() => setSelected((current) => current.includes(String(node.id)) ? current.filter((id) => id !== String(node.id)) : [...current, String(node.id)])} />
                ))}
                {!sortedNodes.length && !isLoading && !isError && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          component="div"
          count={data?.total ?? 0}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }}
          rowsPerPageOptions={[15, 30, 50]}
        />
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}

export default NodeView;
