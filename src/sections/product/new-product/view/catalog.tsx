import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
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
import { useGetCatalogQuery } from '../../../../../redux/service/productSlice';

import { TableNoData } from '../table-no-data';
import { UserTableToolbar } from '../user-table-toolbar';

export function ProductView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();

  const { data, isLoading } = useGetCatalogQuery(
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

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Catalog
        </Typography>
        {/* <Button
          onClick={() => router.push('/create/product')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product
        </Button> */}
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={0}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={`${product.product_name}-${product.price}`} hover>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="right">{product.stock ?? '—'}</TableCell>
                  </TableRow>
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
