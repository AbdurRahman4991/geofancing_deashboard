import { useCallback, useState } from 'react';

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

import { useGetNodesQuery, type HierarchyNode } from '../../../../../redux/service/nodeSlice';
import { useRouter } from 'src/routes/hooks';

const COMPANY_ID = 1;
const DEFAULT_ROWS_PER_PAGE = 15;

export function ViewNodeAssign() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const { data, isLoading, isError } = useGetNodesQuery({
    company_id: COMPANY_ID,
    page: page + 1,
    per_page: rowsPerPage,
  });

  const nodes = data?.data?.data ?? [];
  const search = filterName.trim().toLowerCase();
  const filteredNodes = nodes.filter((node) =>
    [
      node.name,
      node.code ?? '',
      node.level?.name ?? '',
      node.parent?.name ?? '',
      node.status,
      String(node.id),
    ].some((value) => value.toLowerCase().includes(search))
  );

  const getSortValue = (node: HierarchyNode, key: string) => {
    if (key === 'level') return node.level?.name ?? '';
    if (key === 'parent') return node.parent?.name ?? '';
    if (key === 'children_count') return node.children_count ?? 0;
    return node[key as keyof HierarchyNode] ?? '';
  };

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    const left = getSortValue(a, orderBy);
    const right = getSortValue(b, orderBy);
    const comparison =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), undefined, {
            numeric: true,
            sensitivity: 'base',
          });
    return order === 'asc' ? comparison : -comparison;
  });

  const visibleSelectedCount = sortedNodes.filter((node) =>
    selected.includes(String(node.id))
  ).length;

  const handleSelectRow = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const handleSelectAllRows = (checked: boolean) => {
    const visibleIds = sortedNodes.map((node) => String(node.id));
    setSelected((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((id) => !visibleIds.includes(id))
    );
  };

  const handleSort = useCallback((id: string) => {
    setOrder((current) =>
      orderBy === id && current === 'asc' ? 'desc' : 'asc'
    );
    setOrderBy(id);
  }, [orderBy]);

  if (isLoading) {
    return <DashboardContent><Typography>Loading nodes...</Typography></DashboardContent>;
  }

  if (isError) {
    return <DashboardContent><Typography color="error">Failed to load nodes.</Typography></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Nodes</Typography>
        <Button
          onClick={() => router.push('/create/assign-node')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Node
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
            <Table sx={{ minWidth: 1000 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sortedNodes.length}
                numSelected={visibleSelectedCount}
                onSort={handleSort}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'name', label: 'Node Name' },
                  { id: 'code', label: 'Code' },
                  { id: 'level', label: 'Hierarchy Level' },
                  { id: 'parent', label: 'Parent Node' },
                  { id: 'children_count', label: 'Children' },
                  { id: 'status', label: 'Status' },
                  { id: '', label: 'Action' },
                ]}
              />

              <TableBody>
                {sortedNodes.map((node) => (
                  <UserTableRow
                    key={node.id}
                    row={node}
                    selected={selected.includes(String(node.id))}
                    onSelectRow={() => handleSelectRow(String(node.id))}
                  />
                ))}
                {!sortedNodes.length && <TableNoData searchQuery={filterName} />}
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
