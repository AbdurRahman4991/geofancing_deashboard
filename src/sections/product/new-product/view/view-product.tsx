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
import { useGetProductsQuery } from '../../../../../redux/service/productSlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function ProductView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();

  const { data, isLoading } = useGetProductsQuery(
    {
      company_id: companyId,
      ...(filterName.trim() ? { product_name: filterName.trim() } : {}),
      page: page + 1,
      per_page: rowsPerPage,
    },
    { skip: !companyId }
  );

  const products = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? products.map((product) => String(product.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Products
        </Typography>
        <Button
          onClick={() => router.push('/create/product')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product
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
                orderBy="product_name"
                rowCount={products.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'product_name', label: 'Product' },
                  { id: 'category', label: 'Category' },
                  { id: 'brand', label: 'Brand' },
                  { id: 'unit', label: 'Unit' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />

              <TableBody>
                {products.map((product) => (
                  <UserTableRow
                    key={product.id}
                    row={product}
                    selected={selected.includes(String(product.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(product.id))
                          ? current.filter((id) => id !== String(product.id))
                          : [...current, String(product.id)]
                      )
                    }
                  />
                ))}
                {!products.length && !isLoading && <TableNoData searchQuery={filterName} />}
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

export default ProductView;
