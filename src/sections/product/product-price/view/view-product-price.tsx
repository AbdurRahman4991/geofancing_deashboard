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
import { useGetProductPricesQuery } from '../../../../../redux/service/productPriceSlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function ProductPriceView() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();
  const productId = filterName.trim() && Number.isInteger(Number(filterName)) ? Number(filterName) : undefined;

  const { data, isLoading } = useGetProductPricesQuery(
    {
      company_id: companyId,
      ...(productId ? { product_id: productId } : {}),
      page: page + 1,
      per_page: rowsPerPage,
    },
    { skip: !companyId }
  );

  const prices = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? prices.map((price) => String(price.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Product Pricing</Typography>
        <Button
          onClick={() => router.push('/create/product-price')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product Price
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
            <Table sx={{ minWidth: 1100 }}>
              <UserTableHead
                order="asc"
                orderBy="product_id"
                rowCount={prices.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'product', label: 'Product' },
                  { id: 'purchase_price', label: 'Purchase Price' },
                  { id: 'sale_price', label: 'Sale Price' },
                  { id: 'mrp', label: 'MRP' },
                  { id: 'discount', label: 'Discount' },
                  { id: 'tax', label: 'Tax' },
                  { id: 'effective_from', label: 'Effective From' },
                  { id: 'effective_to', label: 'Effective To' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />
              <TableBody>
                {prices.map((price) => (
                  <UserTableRow
                    key={price.id}
                    row={price}
                    selected={selected.includes(String(price.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(price.id))
                          ? current.filter((id) => id !== String(price.id))
                          : [...current, String(price.id)]
                      )
                    }
                  />
                ))}
                {!prices.length && !isLoading && <TableNoData searchQuery={filterName} />}
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

export default ProductPriceView;
