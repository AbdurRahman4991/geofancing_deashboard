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
import { getCurrentCompanyId } from 'src/utils/auth';
import { useRouter } from 'src/routes/hooks';
import { useGetUnitsQuery } from '../../../../../redux/service/unitSlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function UnitView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();

  const { data, isLoading } = useGetUnitsQuery(
    {
      company_id: companyId,
      ...(filterName.trim() ? { unit_name: filterName.trim() } : {}),
      page: page + 1,
      per_page: rowsPerPage,
    },
    { skip: !companyId }
  );

  const units = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? units.map((unit) => String(unit.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Unit
        </Typography>
        <Button
          onClick={() => router.push('/create/unit')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Unit
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
            <Table sx={{ minWidth: 700 }}>
              <UserTableHead
                order="asc"
                orderBy="unit_name"
                rowCount={units.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'unit_name', label: 'Unit' },
                  { id: 'short_name', label: 'Short Name' },
                  { id: 'status', label: 'Status' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />

              <TableBody>
                {units.map((unit) => (
                  <UserTableRow
                    key={unit.id}
                    row={unit}
                    selected={selected.includes(String(unit.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(unit.id))
                          ? current.filter((id) => id !== String(unit.id))
                          : [...current, String(unit.id)]
                      )
                    }
                  />
                ))}
                {!units.length && !isLoading && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={total}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Card>
    </DashboardContent>
  );
}

export default UnitView;