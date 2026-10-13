import { useState, useCallback } from 'react';

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

import { useGetLevelsQuery } from '../../../../../redux/service/levelSlice';
import { useRouter } from 'src/routes/hooks';

// The API response provided for this screen belongs to company 1.
const COMPANY_ID = 1;
const DEFAULT_ROWS_PER_PAGE = 15;

export function LevelView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('level_order');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const { data, isLoading, isError } = useGetLevelsQuery({
    company_id: COMPANY_ID,
    page: page + 1,
    per_page: rowsPerPage,
  });

  const levels = data?.data?.data ?? [];
  const search = filterName.trim().toLowerCase();
  const filteredLevels = levels.filter((level) =>
    [level.name, level.code ?? '', String(level.level_order), String(level.id)]
      .some((value) => value.toLowerCase().includes(search))
  );

  const sortedLevels = [...filteredLevels].sort((a, b) => {
    const left = a[orderBy as keyof typeof a];
    const right = b[orderBy as keyof typeof b];
    const comparison =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left ?? '').localeCompare(String(right ?? ''), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
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

  const handleSort = useCallback((id: string) => {
    setOrder((current) => (orderBy === id && current === 'asc' ? 'desc' : 'asc'));
    setOrderBy(id);
  }, [orderBy]);

  if (isLoading) {
    return <DashboardContent><Typography>Loading levels...</Typography></DashboardContent>;
  }

  if (isError) {
    return <DashboardContent><Typography color="error">Failed to load levels.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}> Levels</Typography>
        <Button
          onClick={() => router.push('/hierarchy/create-level')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Level
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
            <Table sx={{ minWidth: 900 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sortedLevels.length}
                numSelected={visibleSelectedCount}
                onSort={handleSort}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'name', label: 'Level Name' },
                  { id: 'code', label: 'Code' },
                  { id: 'level_order', label: 'Order' },
                  { id: 'nodes_count', label: 'Nodes' },
                  { id: 'is_active', label: 'Status' },
                  { id: '', label: 'Action' },
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
                {!sortedLevels.length && (
                  <TableNoData searchQuery={filterName} />
                )}
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

export default LevelView;


