import { useEffect, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAttendanceHistoryQuery, useUpdateAttendanceMutation } from '../../../../redux/service/attendanceHistory';
import type { Attendance } from '../../../../redux/service/attendanceHistory';
import { toast } from 'react-toastify';

type AttendanceForm = {
  user_id: string;
  geofence_id: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  distance_from_office: string;
  remarks: string;
};

const toDateTimeInput = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toApiDateTime = (value: string) => value ? `${value.replace('T', ' ')}:00` : null;

const toForm = (attendance: Attendance): AttendanceForm => ({
  user_id: String(attendance.user_id ?? ''),
  geofence_id: String(attendance.geofence_id ?? ''),
  check_in_time: toDateTimeInput(attendance.check_in_time),
  check_out_time: toDateTimeInput(attendance.check_out_time),
  status: attendance.status ?? '',
  distance_from_office: attendance.distance_from_office == null ? '' : String(attendance.distance_from_office),
  remarks: attendance.remarks ?? '',
});

export default function AttendanceUpdateView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAttendanceHistoryQuery({ page: 1, per_page: 1000 });
  const [updateAttendance, { isLoading: isSaving }] = useUpdateAttendanceMutation();
  const attendance = useMemo(() => data?.data.find((item) => String(item.id) === id), [data, id]);
  const [form, setForm] = useState<AttendanceForm>({
    user_id: '', geofence_id: '', check_in_time: '', check_out_time: '', status: '', distance_from_office: '', remarks: '',
  });

  useEffect(() => {
    if (attendance) setForm(toForm(attendance));
  }, [attendance]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!attendance) return;
    if (!form.user_id || !form.status) {
      toast.error('User ID and status are required.');
      return;
    }
    try {
      await updateAttendance({
        id: attendance.id,
        data: {
          user_id: Number(form.user_id),
          geofence_id: form.geofence_id ? Number(form.geofence_id) : null,
          check_in_time: toApiDateTime(form.check_in_time),
          check_out_time: toApiDateTime(form.check_out_time),
          status: form.status,
          distance_from_office: form.distance_from_office === '' ? null : form.distance_from_office,
          remarks: form.remarks || null,
        },
      }).unwrap();
      toast.success('Attendance updated successfully.');
      navigate('/attendance');
    } catch {
      toast.error('Could not update attendance.');
    }
  };

  if (isLoading) return <DashboardContent><Typography>Loading attendance record...</Typography></DashboardContent>;
  if (isError) return <DashboardContent><Alert severity="error">Could not load attendance history.</Alert></DashboardContent>;
  if (!attendance) return <DashboardContent><Alert severity="warning">Attendance record not found in the loaded records.</Alert></DashboardContent>;

  return <DashboardContent>
    <Box sx={{ mb: 3 }}><Typography variant="h4">Update Attendance</Typography></Box>
    <Card sx={{ p: 3, maxWidth: 800 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="User Name" value={attendance.user?.name ?? '—'} InputProps={{ readOnly: true }} />
          <TextField name="user_id" label="User ID" type="number" value={form.user_id} InputProps={{ readOnly: true }} />
          <TextField label="Firm Name" value={attendance.geofence?.firm_name ?? '—'} InputProps={{ readOnly: true }} />
          <TextField name="geofence_id" label="Geofence ID" type="number" value={form.geofence_id} InputProps={{ readOnly: true }} />
          <TextField name="check_in_time" label="Check In" type="datetime-local" value={form.check_in_time} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
          <TextField name="check_out_time" label="Check Out" type="datetime-local" value={form.check_out_time} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
          <TextField name="status" label="Status" select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} required>
            {[...new Set([form.status, 'Checked In', 'Checked Out', 'Absent', 'Leave'].filter(Boolean))].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>
          <TextField name="distance_from_office" label="Distance (m)" type="number" value={form.distance_from_office} InputProps={{ readOnly: true }} />
          <TextField name="remarks" label="Remarks" value={form.remarks} onChange={handleChange} multiline minRows={2} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/attendance')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSaving}>{isSaving ? 'Updating...' : 'Update Attendance'}</Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  </DashboardContent>;
}
