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
import { useGetCategoriesQuery } from '../../../../../redux/service/categorySlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function CategoryView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();

  const { data, isLoading } = useGetCategoriesQuery(
    { company_id: companyId, page: page + 1, per_page: rowsPerPage },
    { skip: !companyId }
  );

  // Laravel pagination response: { status, data: { data: Category[], total, ... } }
  const categories = data?.data.data ?? [];
  const visibleCategories = filterName.trim()
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(filterName.trim().toLowerCase())
      )
    : categories;
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? visibleCategories.map((category) => String(category.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Category
        </Typography>
        <Button
          onClick={() => router.push('/create/category')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Category
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
                order="asc"
                orderBy="name"
                rowCount={visibleCategories.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'name', label: 'Category' },
                  { id: 'description', label: 'Description' },
                  { id: 'subcategories', label: 'Subcategories' },
                  { id: 'status', label: 'Status' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />

              <TableBody>
                {visibleCategories.map((category) => (
                  <UserTableRow
                    key={category.id}
                    row={category}
                    selected={selected.includes(String(category.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(category.id))
                          ? current.filter((id) => id !== String(category.id))
                          : [...current, String(category.id)]
                      )
                    }
                  />
                ))}

                {!visibleCategories.length && !isLoading && (
                  <TableNoData searchQuery={filterName} />
                )}
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

export default CategoryView;

