import { useState, useEffect } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';

import { useParams } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  useGetSingleCountryQuery,
  useUpdateCountryMutation,
} from '../../../../../redux/service/countrySlice';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CountryUpdateView() {
  const { id } = useParams();

  const {
    data: country,
    isLoading: isFetching,
    isError: isFetchError,
  } = useGetSingleCountryQuery(Number(id), {
    skip: !id,
  });

  const [updateCountry, { isLoading }] =
    useUpdateCountryMutation();

  const [form, setForm] = useState({
    name: '',
    code: '',
    status: 1,
  });

  const [errors, setErrors] = useState({});

  // ----------------------------------------------------------------------
  // LOAD COUNTRY DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (country) {
      console.log('Country data:', country);

      setForm({
        name: country.name || '',
        code: country.code || '',
        status: country.status ?? 1,
      });
    }
  }, [country]);

  // ----------------------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ----------------------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Country name is required';
    }

    if (!form.code.trim()) {
      newErrors.code = 'Country code is required';
    }

    if (form.status !== 0 && form.status !== 1) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------------------------------------------
  // UPDATE COUNTRY
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error('Country ID is missing');
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateCountry({
        id: Number(id),
        data: {
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          status: form.status,
        },
      }).unwrap();

      toast.success('Country updated successfully!');
    } catch (error) {
      console.error('Update country error:', error);

      toast.error(
        error?.data?.message || 'Failed to update country'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (isFetching) {
    return (
      <DashboardContent>
        <Typography>Loading country...</Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (isFetchError || !country) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load country.
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Country
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>

          {/* Country Name */}
          <TextField
            label="Country Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          {/* Country Code */}
          <TextField
            label="Country Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={
              errors.code || 'Example: BD, IN, US'
            }
            inputProps={{
              maxLength: 3,
            }}
            fullWidth
          />

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            error={!!errors.status}
            helperText={errors.status}
            fullWidth
          >
            <MenuItem value={1}>
              Active
            </MenuItem>

            <MenuItem value={0}>
              Inactive
            </MenuItem>
          </TextField>

          {/* Update Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Country'}
          </Button>

        </Stack>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </DashboardContent>
  );
}
