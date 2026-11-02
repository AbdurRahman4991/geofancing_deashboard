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
import { useGetProductStocksQuery } from '../../../../../redux/service/productStockSlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';

export function ViewProductStock() {
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const router = useRouter();
  const productIdFilter = filterName.trim() && Number.isInteger(Number(filterName)) ? Number(filterName) : undefined;

  const { data, isLoading } = useGetProductStocksQuery(
    {
      company_id: companyId,
      ...(productIdFilter ? { product_id: productIdFilter } : {}),
      page: page + 1,
      per_page: rowsPerPage,
    },
    { skip: !companyId }
  );

  const stocks = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? stocks.map((stock) => String(stock.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Product Stock</Typography>
        <Button
          onClick={() => router.push('/create/product-stock')}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Product Stock
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
                orderBy="product_id"
                rowCount={stocks.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'product_name', label: 'Product' },
                  { id: 'unit', label: 'Unit' },
                  { id: 'warehouse_id', label: 'Warehouse ID' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'reserved_quantity', label: 'Reserved' },
                  { id: 'reorder_level', label: 'Reorder Level' },
                  { id: 'created_at', label: 'Created' },
                  { id: 'actions', label: 'Action', align: 'right' },
                ]}
              />
              <TableBody>
                {stocks.map((stock) => (
                  <UserTableRow
                    key={stock.id}
                    row={stock}
                    selected={selected.includes(String(stock.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(stock.id))
                          ? current.filter((id) => id !== String(stock.id))
                          : [...current, String(stock.id)]
                      )
                    }
                  />
                ))}
                {!stocks.length && !isLoading && <TableNoData searchQuery={filterName} />}
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

export default ViewProductStock;
