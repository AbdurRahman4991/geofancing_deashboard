
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
  useGetSingleRegionQuery,
  useUpdateRegionMutation,
} from '../../../../../redux/service/regionSlice';

import {
  useGetCountriesQuery,
} from '../../../../../redux/service/countrySlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function RegionUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single Region
  // ==============================

  const {
    data: region,
    isLoading: isFetchingRegion,
    isError: isRegionError,
  } = useGetSingleRegionQuery(Number(id), {
    skip: !id,
  });

  // ==============================
  // Get Countries
  // ==============================

  const {
    data: countryData,
    isLoading: isFetchingCountries,
  } = useGetCountriesQuery();

  const countries = countryData?.data ?? [];

  // ==============================
  // Update Region
  // ==============================

  const [
    updateRegion,
    { isLoading: isUpdating },
  ] = useUpdateRegionMutation();

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

  const [errors, setErrors] = useState({});

  // ----------------------------------------------------------------------
  // LOAD REGION DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (region) {
      console.log('Region data:', region);

      setForm({
        country_id: String(
          region.country_id ?? ''
        ),
        name: region.name || '',
        status: region.status ?? 1,
      });
    }
  }, [region]);

  // ----------------------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'status'
          ? Number(value)
          : value,
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

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ----------------------------------------------------------------------
  // UPDATE REGION
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Region ID is missing'
      );
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateRegion({
        id: Number(id),

        data: {
          country_id: Number(
            form.country_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Region updated successfully!'
      );
    } catch (error) {
      console.error(
        'Update region error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update region'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingRegion ||
    isFetchingCountries
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading region...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isRegionError ||
    !region
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load region.
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------

  return (
    <DashboardContent>

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Update Region
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
          >
            {countries.map((country) => (
              <MenuItem
                key={country.id}
                value={country.id}
              >
                {country.name}

                {country.code
                  ? ` (${country.code})`
                  : ''}
              </MenuItem>
            ))}
          </TextField>

          {/* ============================== */}
          {/* Region Name */}
          {/* ============================== */}

          <TextField
            label="Region Name"
            name="name"
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

          {/* ============================== */}
          {/* Update Button */}
          {/* ============================== */}

          <Button
            variant="contained"
            size="large"
            fullWidth
            color="inherit"
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating
              ? 'Updating...'
              : 'Update Region'}
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

