import Chip from '@mui/material/Chip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import type { TourPlan } from '../../../redux/service/tourPlanService';

export function UserTableRow({ row }: { row: TourPlan }) {
  const color = row.status === 'approved' ? 'success' : row.status === 'rejected' || row.status === 'cancelled' ? 'error' : 'default';
  return (
    <TableRow hover>
      <TableCell><Typography variant="subtitle2">{row.employee?.name ?? `User #${row.user_id}`}</Typography></TableCell>
      <TableCell>{row.plan_date}</TableCell>
      <TableCell>{row.stops?.length ?? 0}</TableCell>
      <TableCell>{row.notes || '-'}</TableCell>
      <TableCell><Chip size="small" label={row.status} color={color} /></TableCell>
    </TableRow>
  );
}
