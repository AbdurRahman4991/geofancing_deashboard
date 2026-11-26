import { useCallback, useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { toast } from 'react-toastify';
import {
  useApproveTourPlanMutation,
  useCancelTourPlanMutation,
  useRejectTourPlanMutation,
  useSubmitTourPlanMutation,
  type TourPlan,
  type TourPlanStatus,
} from '../../../redux/service/tourPlanService';

function getStatusColor(status: TourPlanStatus): 'success' | 'warning' | 'error' | 'default' {
  if (status === 'approved') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'rejected' || status === 'cancelled') return 'error';
  return 'default';
}

export function UserTableRow({ row }: { row: TourPlan }) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [currentStatus, setCurrentStatus] = useState<TourPlanStatus>(row.status);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [submitTourPlan, { isLoading: submitting }] = useSubmitTourPlanMutation();
  const [approveTourPlan, { isLoading: approving }] = useApproveTourPlanMutation();
  const [rejectTourPlan, { isLoading: rejecting }] = useRejectTourPlanMutation();
  const [cancelTourPlan, { isLoading: cancelling }] = useCancelTourPlanMutation();
  const router = useRouter();
  const updatingStatus = submitting || approving || rejecting || cancelling;
  const availableStatuses: TourPlanStatus[] = row.status === 'draft' || row.status === 'rejected'
    ? [row.status, 'pending', 'cancelled']
    : row.status === 'pending'
      ? ['pending', 'approved', 'rejected', 'cancelled']
      : [row.status];

  useEffect(() => setCurrentStatus(row.status), [row.status]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);
  const handleClosePopover = useCallback(() => setOpenPopover(null), []);
  const handleEdit = () => {
    handleClosePopover();
    router.push(`/edit/tour-plan/${row.id}`);
  };
  const performStatusChange = async (status: TourPlanStatus, note?: string): Promise<boolean> => {
    try {
      let response: { message?: string };
      if (status === 'pending') response = await submitTourPlan(row.id).unwrap();
      else if (status === 'approved') response = await approveTourPlan({ id: row.id }).unwrap();
      else if (status === 'rejected') response = await rejectTourPlan({ id: row.id, review_note: note ?? '' }).unwrap();
      else if (status === 'cancelled') response = await cancelTourPlan(row.id).unwrap();
      else return false;
      setCurrentStatus(status);
      toast.success(response.message || 'Tour plan status updated');
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update tour plan status');
      return false;
    }
  };

  const handleStatusChange = (status: TourPlanStatus) => {
    if (status === currentStatus) return;
    if (status === 'rejected') {
      setReviewNote('');
      setRejectDialogOpen(true);
      return;
    }
    void performStatusChange(status);
  };

  const handleReject = async () => {
    if (!reviewNote.trim()) return;
    if (await performStatusChange('rejected', reviewNote.trim())) setRejectDialogOpen(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell><Typography variant="subtitle2">{row.employee?.name ?? `User #${row.user_id}`}</Typography></TableCell>
        <TableCell>{row.plan_date}</TableCell>
        <TableCell>{row.stops?.length ?? 0}</TableCell>
        <TableCell>{row.notes || '-'}</TableCell>
        <TableCell>
          <FormControl size="small" sx={{ minWidth: 135 }}>
            <Select
              value={currentStatus}
              onChange={(event) => handleStatusChange(event.target.value as TourPlanStatus)}
              disabled={updatingStatus}
              renderValue={(value) => <Chip size="small" label={value} color={getStatusColor(value as TourPlanStatus)} />}
              inputProps={{ 'aria-label': `Update status for tour plan ${row.id}` }}
            >
              {availableStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="right">
          {(row.status === 'draft' || row.status === 'rejected') && (
            <IconButton aria-label={`Actions for tour plan ${row.id}`} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList disablePadding sx={{ p: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75 } }}>
          {(row.status === 'draft' || row.status === 'rejected') && (
            <MenuItem onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          )}
        </MenuList>
      </Popover>
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reject tour plan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            fullWidth
            multiline
            minRows={3}
            label="Review note"
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={rejecting}>Cancel</Button>
          <Button onClick={handleReject} color="error" variant="contained" disabled={!reviewNote.trim() || rejecting}>
            {rejecting ? 'Rejecting...' : 'Reject plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
