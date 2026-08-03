
import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';

import {
  useGetSingleGeofenceQuery,
  useUpdateGeofenceMutation,
} from '../../../../redux/service/geofenchSlice';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ------------------------------------
// TYPES
// ------------------------------------
type FormState = {
  company_id: string;
  user_id: string;
  latitude: number | '';
  longitude: number | '';
  radius: number | '';
};


export default function GeofenceUpdateView() {
  // ------------------------------------
  // GET ID FROM ROUTE
  // ------------------------------------
 const { id } = useParams<{ id: string }>();

const {
  data: geofence,
  isLoading: isFetching,
} = useGetSingleGeofenceQuery(id!, {
  skip: !id,
});



  // ------------------------------------
  // UPDATE MUTATION
  // ------------------------------------
  const [updateGeofence, { isLoading }] =
    useUpdateGeofenceMutation();

  // ------------------------------------
  // FORM STATE
  // ------------------------------------
const [form, setForm] = useState<FormState>({
  company_id: '',
  user_id: '',
  latitude: '',
  longitude: '',
  radius: '',
});


  const [errors, setErrors] = useState<Partial<FormState>>({});

  // ------------------------------------
  // PREFILL FORM
  // ------------------------------------
useEffect(() => {
  console.log('Geofence data:', geofence);
  if (geofence) {
    setForm({
      company_id: String(geofence.company_id),
      user_id: String(geofence.user_id),
      latitude: Number(geofence.latitude),
      longitude: Number(geofence.longitude),
      radius: Number(geofence.radius),
    });
  }
}, [geofence]);


  // ------------------------------------
  // HANDLE CHANGE
  // ------------------------------------
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]:
      name === 'latitude' ||
      name === 'longitude' ||
      name === 'radius'
        ? value === '' ? '' : Number(value)
        : value,
  }));
};


  // ------------------------------------
  // VALIDATION
  // ------------------------------------
  const validate = () => {
  const newErrors: Partial<Record<keyof FormState, string>> = {};

  if (!form.company_id.trim())
    newErrors.company_id = 'Company is required';

  if (!form.user_id.trim())
    newErrors.user_id = 'User is required';

  if (form.latitude === '' || isNaN(form.latitude))
    newErrors.latitude = 'Latitude is required';

  if (form.longitude === '' || isNaN(form.longitude))
    newErrors.longitude = 'Longitude is required';

  if (form.radius === '' || isNaN(form.radius))
    newErrors.radius = 'Radius is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // ------------------------------------
  // SUBMIT
  // ------------------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await updateGeofence({
        id,
        data: {
          company_id: Number(form.company_id),
          user_id: Number(form.user_id),
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          radius: Number(form.radius),
        },
      }).unwrap();

      toast.success('Geofence updated successfully!');
    } catch (error) {
      toast.error('Failed to update geofence');
    }
  };

  // ------------------------------------
  // LOADING STATE
  // ------------------------------------
  if (isFetching) {
    return (
      <DashboardContent>
        <Typography>Loading...</Typography>
      </DashboardContent>
    );
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Role
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>
          <TextField
            label="Company ID"
            name="company_id"
            value={form.company_id} 
            onChange={handleChange}
            error={!!errors.company_id}
            helperText={errors.company_id}
          />

          <TextField
            label="User ID"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            error={!!errors.user_id}
            helperText={errors.user_id}
          />

          <TextField
            label="Latitude"
            name="latitude"
            type="number"
            value={form.latitude}
            onChange={handleChange}
            error={!!errors.latitude}
            helperText={errors.latitude}
          />

          <TextField
            label="Longitude"
            name="longitude"
            type="number"
            value={form.longitude}
            onChange={handleChange}
            error={!!errors.longitude}
            helperText={errors.longitude}
          />

          <TextField
            label="Radius (Meter)"
            name="radius"
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
            {isLoading ? 'Updating...' : 'Update Role'}
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}