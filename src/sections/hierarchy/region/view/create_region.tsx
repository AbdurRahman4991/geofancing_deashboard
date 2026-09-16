
import { useState } from 'react';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  useCreateRegionMutation,
} from '../../../../../redux/service/regionSlice';

import {
  useGetCountriesQuery,
} from '../../../../../redux/service/countrySlice';

// ----------------------------------------------------------------------

export default function RegionCreateView() {
  // ==============================
  // Region API
  // ==============================

  const [
    createRegion,
    { isLoading: isCreating },
  ] = useCreateRegionMutation();

  // ==============================
  // Country API
  // ==============================

  const {
    data: countryData,
    isLoading: isCountriesLoading,
  } = useGetCountriesQuery();

  const countries = countryData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    country_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    country_id?: string;
    name?: string;
    status?: string;
  }>({});

  // ==============================
  // Handle Change
  // ==============================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'country_id'
          ? value
          : name === 'status'
            ? Number(value)
            : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ==============================
  // Validation
  // ==============================

  const validate = () => {
    const newErrors: {
      country_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.country_id) {
      newErrors.country_id =
        'Country is required';
    }

    if (!form.name.trim()) {
      newErrors.name =
        'Region name is required';
    }

    if (
      form.status !== 0 &&
      form.status !== 1
    ) {
      newErrors.status =
        'Status is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createRegion({
        country_id: Number(form.country_id),
        name: form.name.trim(),
        status: form.status,
      }).unwrap();

      toast.success(
        'Region created successfully'
      );

      // Reset form

      setForm({
        country_id: '',
        name: '',
        status: 1,
      });

      setErrors({});
    } catch (err: any) {
      console.error(
        'Create region error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create region'
      );
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <DashboardContent>

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Create Region
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>

          {/* ============================== */}
          {/* Country */}
          {/* ============================== */}

          <TextField
            select
            name="country_id"
            label="Country"
            value={form.country_id}
            onChange={handleChange}
            error={!!errors.country_id}
            helperText={
              errors.country_id
            }
            fullWidth
            disabled={isCountriesLoading}
          >
            {isCountriesLoading ? (
              <MenuItem value="">
                Loading countries...
              </MenuItem>
            ) : (
              countries.map((country) => (
                <MenuItem
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                  {country.code
                    ? ` (${country.code})`
                    : ''}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* ============================== */}
          {/* Region Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Region Name"
            placeholder="Example: Dhaka Region"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          {/* ============================== */}
          {/* Status */}
          {/* ============================== */}

          <TextField
            select
            name="status"
            label="Status"
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

          {/* ============================== */}
          {/* Submit */}
          {/* ============================== */}

          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={
              isCreating ||
              isCountriesLoading
            }
          >
            {isCreating
              ? 'Saving...'
              : 'Create Region'}
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

