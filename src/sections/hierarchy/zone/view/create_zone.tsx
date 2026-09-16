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
  useCreateZoneMutation,
} from '../../../../../redux/service/zoneSlice';

import {
  useGetRegionsQuery,
} from '../../../../../redux/service/regionSlice';

// ----------------------------------------------------------------------

export default function ZoneCreateView() {
  // ==============================
  // Zone API
  // ==============================

  const [
    createZone,
    { isLoading: isCreating },
  ] = useCreateZoneMutation();

  // ==============================
  // Region API
  // ==============================

  const {
    data: regionData,
    isLoading: isRegionsLoading,
  } = useGetRegionsQuery();

  const regions = regionData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    region_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    region_id?: string;
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
        name === 'region_id'
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
      region_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.region_id) {
      newErrors.region_id =
        'Region is required';
    }

    if (!form.name.trim()) {
      newErrors.name =
        'Zone name is required';
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
      await createZone({
        region_id: Number(form.region_id),
        name: form.name.trim(),
        status: form.status,
      }).unwrap();

      toast.success(
        'Zone created successfully'
      );

      // Reset form

      setForm({
        region_id: '',
        name: '',
        status: 1,
      });

      setErrors({});
    } catch (err: any) {
      console.error(
        'Create zone error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create zone'
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
        Create Zone
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>

          {/* ============================== */}
          {/* Region */}
          {/* ============================== */}

          <TextField
            select
            name="region_id"
            label="Region"
            value={form.region_id}
            onChange={handleChange}
            error={!!errors.region_id}
            helperText={errors.region_id}
            fullWidth
            disabled={isRegionsLoading}
          >
            {isRegionsLoading ? (
              <MenuItem value="">
                Loading regions...
              </MenuItem>
            ) : (
              regions.map((region) => (
                <MenuItem
                  key={region.id}
                  value={region.id}
                >
                  {region.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* ============================== */}
          {/* Zone Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Zone Name"
            placeholder="Example: North-East Zone"
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
              isRegionsLoading
            }
          >
            {isCreating
              ? 'Saving...'
              : 'Create Zone'}
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