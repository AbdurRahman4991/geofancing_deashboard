import { useState } from 'react';

import Chip from '@mui/material/Chip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';

import {
  useUpdateOrderStatusMutation,
  type Order,
  type OrderStatus,
} from '../../../../redux/service/orderSlice';

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancel' },
  { value: 'delivered', label: 'Delivery' },
];

function statusColor(status: string): 'success' | 'warning' | 'error' | 'default' {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}

type UserTableRowProps = {
  row: Order;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [currentStatus, setCurrentStatus] = useState(row.status.toLowerCase());

  const handleStatusChange = async (status: OrderStatus) => {
    const previousStatus = currentStatus;
    setCurrentStatus(status);
    try {
      const response = await updateOrderStatus({
        id: row.id,
        company_id: row.company_id,
        status,
      }).unwrap();
      toast.success(response.message || 'Order status updated');
    } catch (error: any) {
      setCurrentStatus(previousStatus);
      toast.error(error?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">{row.order_number}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{row.geofence?.firm_name ?? `Geofence #${row.geofence_id}`}</Typography>
        {row.geofence?.address && <Typography variant="caption" color="text.secondary">{row.geofence.address}</Typography>}
      </TableCell>
      <TableCell>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={currentStatus}
            onChange={(event) => handleStatusChange(event.target.value as OrderStatus)}
            disabled={isLoading}
            renderValue={(value) => <Chip size="small" label={value} color={statusColor(value)} />}
            inputProps={{ 'aria-label': `Update status for ${row.order_number}` }}
          >
            {orderStatuses.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        {row.items?.length ? row.items.map((item) => (
          <Typography key={item.id} variant="body2">
            {item.product?.product_name ?? `Product #${item.product_id}`} × {item.quantity}
          </Typography>
        )) : '—'}
      </TableCell>
      <TableCell>{row.total}</TableCell>
      <TableCell>{row.notes || '—'}</TableCell>
      <TableCell>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</TableCell>
    </TableRow>
  );
}


