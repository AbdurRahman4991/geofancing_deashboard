import { useState } from 'react';
import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ধরলাম তুমি এই mutation বানাবে
import { useCreateGeofenceMutation } from '../../../../redux/service/geofenchSlice';

export default function GeofenceCreateView() {

  const [createGeofence, { isLoading }] = useCreateGeofenceMutation();

  const [form, setForm] = useState({
    company_id: '',
    user_id: '',
    latitude: '',
    longitude: '',
    radius: '',
  });

  const [errors, setErrors] = useState<any>({});

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // -------------------------
  // VALIDATION
  // -------------------------
  const validate = () => {
    const newErrors: any = {};

    if (!form.company_id.trim()) newErrors.company_id = 'Company is required';
    if (!form.user_id.trim()) newErrors.user_id = 'User is required';
    if (!form.latitude) newErrors.latitude = 'Latitude is required';
    if (!form.longitude) newErrors.longitude = 'Longitude is required';
    if (!form.radius) newErrors.radius = 'Radius is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createGeofence(form).unwrap();
      toast.success('Geofence created successfully');

      setForm({
        company_id: '',
        user_id: '',
        latitude: '',
        longitude: '',
        radius: '',
      });
      setErrors({});
    } catch (err: any) {
      toast.error('Failed to create geofence');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Geofence
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>

          <TextField
            name="company_id"
            label="Company"
            value={form.company_id}
            onChange={handleChange}
            error={!!errors.company}
            helperText={errors.company}
          />

          <TextField
            name="user_id"
            label="User"
            value={form.user_id}
            onChange={handleChange}
            error={!!errors.user}
            helperText={errors.user}
          />

          <TextField
            name="latitude"
            label="Latitude"
            type="number"
            value={form.latitude}
            onChange={handleChange}
            error={!!errors.latitude}
            helperText={errors.latitude}
          />

          <TextField
            name="longitude"
            label="Longitude"
            type="number"
            value={form.longitude}
            onChange={handleChange}
            error={!!errors.longitude}
            helperText={errors.longitude}
          />

          <TextField
            name="radius"
            label="Radius (Meter)"
            type="number"
            value={form.radius}
            onChange={handleChange}
            error={!!errors.radius}
            helperText={errors.radius}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Create Geofence'}
          </Button>

        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
