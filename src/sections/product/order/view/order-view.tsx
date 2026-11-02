import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetOrdersQuery } from '../../../../../redux/service/orderSlice';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';

export function OrderView() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const rowsPerPage = 10;
  const companyId = getCurrentCompanyId();
  const { data, isLoading } = useGetOrdersQuery(
    { company_id: companyId, page: page + 1, per_page: rowsPerPage },
    { skip: !companyId }
  );

  const orders = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? orders.map((order) => String(order.id)) : []);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Orders</Typography>
      </Box>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 1000 }}>
              <UserTableHead
                order="asc"
                orderBy="order_number"
                rowCount={orders.length}
                numSelected={selected.length}
                onSort={() => undefined}
                onSelectAllRows={handleSelectAll}
                headLabel={[
                  { id: 'order_number', label: 'Order Number' },
                  { id: 'geofence', label: 'Geofence' },
                  { id: 'status', label: 'Status' },
                  { id: 'items', label: 'Items' },
                  { id: 'total', label: 'Total' },
                  { id: 'notes', label: 'Notes' },
                  { id: 'created_at', label: 'Created' },
                ]}
              />
              <TableBody>
                {orders.map((order) => (
                  <UserTableRow
                    key={order.id}
                    row={order}
                    selected={selected.includes(String(order.id))}
                    onSelectRow={() =>
                      setSelected((current) =>
                        current.includes(String(order.id))
                          ? current.filter((id) => id !== String(order.id))
                          : [...current, String(order.id)]
                      )
                    }
                  />
                ))}
                {!orders.length && !isLoading && <TableNoData searchQuery="" />}
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

export default OrderView;



