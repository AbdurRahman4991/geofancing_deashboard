import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetCompanyQuery } from '../../../../../../redux/service/companySlice';
import { useGetCountryHiearchyLevelsQuery } from '../../../../../../redux/service/countryHiearchyLevelService';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

const DEFAULT_ROWS_PER_PAGE = 15;

export function LevelView() {
  const currentCompanyId = getCurrentCompanyId();
  const [companySelection, setCompanySelection] = useState('');
  const companyId = currentCompanyId || Number(companySelection);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filterName, setFilterName] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('level_order');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const { data: companyData, isLoading: isCompaniesLoading } = useGetCompanyQuery(
    { page: 1, limit: 100 },
    { skip: Boolean(currentCompanyId) }
  );
  const companies = companyData?.data ?? [];
  const { data, isLoading, isError } = useGetCountryHiearchyLevelsQuery(
    {
      company_id: companyId,
      page: page + 1,
      per_page: rowsPerPage,
      search: filterName.trim() || undefined,
      is_active: activeFilter === 'all' ? undefined : activeFilter === 'active',
    },
    { skip: !companyId }
  );

  const levels = data?.data ?? [];
  const sortedLevels = [...levels].sort((a, b) => {
    const left = a[orderBy as keyof typeof a];
    const right = b[orderBy as keyof typeof b];
    const comparison = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
  const visibleSelectedCount = sortedLevels.filter((level) => selected.includes(String(level.id))).length;

  const handleSelectRow = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  };
  const handleSelectAllRows = (checked: boolean) => {
    const visibleIds = sortedLevels.map((level) => String(level.id));
    setSelected((current) => checked
      ? Array.from(new Set([...current, ...visibleIds]))
      : current.filter((id) => !visibleIds.includes(id)));
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Country Levels</Typography>
        {!currentCompanyId && (
          <TextField
            select
            size="small"
            label="Company"
            value={companySelection}
            onChange={(event) => {
              setCompanySelection(event.target.value);
              setPage(0);
              setSelected([]);
            }}
            disabled={isCompaniesLoading}
            sx={{ minWidth: 220 }}
          >
            {companies.map((company) => <MenuItem key={company.id} value={String(company.id)}>{company.company_name}</MenuItem>)}
          </TextField>
        )}
        <TextField
          select
          size="small"
          label="Status"
          value={activeFilter}
          onChange={(event) => {
            setActiveFilter(event.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <Button
          onClick={() => router.push('/create/country-hiearchy-lavel')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          disabled={!companyId}
        >
          New Country Level
        </Button>
      </Box>

      {!companyId && <Alert severity="info" sx={{ mb: 2 }}>Select a company to view its country levels.</Alert>}
      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load country levels.</Alert>}

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
            setSelected([]);
          }}
        />
        {isLoading && <LinearProgress />}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sortedLevels.length}
                numSelected={visibleSelectedCount}
                onSort={(id) => {
                  setOrder((current) => (orderBy === id && current === 'asc' ? 'desc' : 'asc'));
                  setOrderBy(id);
                }}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'name', label: 'Level Name' },
                  { id: 'code', label: 'Code' },
                  { id: 'level_order', label: 'Order' },
                  { id: 'nodes_count', label: 'Nodes' },
                  { id: 'is_active', label: 'Status' },
                  { id: 'actions', label: 'Action' },
                ]}
              />
              <TableBody>
                {sortedLevels.map((level) => (
                  <UserTableRow
                    key={level.id}
                    row={level}
                    selected={selected.includes(String(level.id))}
                    onSelectRow={() => handleSelectRow(String(level.id))}
                  />
                ))}
                {!sortedLevels.length && !isLoading && !isError && <TableNoData searchQuery={filterName} />}
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

export default LevelView;
