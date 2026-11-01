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
import { useGetSubCategoriesQuery } from '../../../../../redux/service/subCategorySlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function SubCategoryView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();

  const { data, isLoading } = useGetSubCategoriesQuery(
    { company_id: companyId, page: page + 1, per_page: rowsPerPage },
    { skip: !companyId }
  );

  // Laravel pagination response: { status, data: { data: SubCategory[], total, ... } }
  const subCategories = data?.data.data ?? [];
  const visibleSubCategories = filterName.trim()
    ? subCategories.filter((subCategory) =>
        `${subCategory.name} ${subCategory.category?.name ?? ''}`
          .toLowerCase()
          .includes(filterName.trim().toLowerCase())
      )
    : subCategories;
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? visibleSubCategories.map((item) => String(item.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Sub Category
        </Typography>
        <Button
          onClick={() => router.push('/create/sub-category')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Sub-Category
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
                rowCount={visibleSubCategories.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'name', label: 'Sub-category' },
                  { id: 'category', label: 'Category' },
                  { id: 'description', label: 'Description' },
                  { id: 'status', label: 'Status' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />

              <TableBody>
                {visibleSubCategories.map((subCategory) => (
                  <UserTableRow
                    key={subCategory.id}
                    row={subCategory}
                    selected={selected.includes(String(subCategory.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(subCategory.id))
                          ? current.filter((itemId) => itemId !== String(subCategory.id))
                          : [...current, String(subCategory.id)]
                      )
                    }
                  />
                ))}

                {!visibleSubCategories.length && !isLoading && (
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

export default SubCategoryView;
