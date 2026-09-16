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
  useCreateDivisionMutation,
} from '../../../../../redux/service/divisionSlice';

import {
  useGetZonesQuery,
} from '../../../../../redux/service/zoneSlice';

// ----------------------------------------------------------------------

export default function DivisionCreateView() {
  // ==============================
  // Division API
  // ==============================

  const [
    createDivision,
    { isLoading: isCreating },
  ] = useCreateDivisionMutation();

  // ==============================
  // Zone API
  // ==============================

  const {
    data: zoneData,
    isLoading: isZonesLoading,
  } = useGetZonesQuery();

  const zones = zoneData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    zone_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    zone_id?: string;
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
        name === 'zone_id'
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
      zone_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.zone_id) {
      newErrors.zone_id = 'Zone is required';
    }

    if (!form.name.trim()) {
      newErrors.name = 'Division name is required';
    }

    if (
      form.status !== 0 &&
      form.status !== 1
    ) {
      newErrors.status = 'Status is required';
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
      await createDivision({
        zone_id: Number(form.zone_id),
        name: form.name.trim(),
        status: form.status,
      }).unwrap();

      toast.success(
        'Division created successfully'
      );

      // Reset form

      setForm({
        zone_id: '',
        name: '',
        status: 1,
      });

      setErrors({});
    } catch (err: any) {
      console.error(
        'Create division error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create division'
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
        Create Division
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>

          {/* ============================== */}
          {/* Zone */}
          {/* ============================== */}

          <TextField
            select
            name="zone_id"
            label="Zone"
            value={form.zone_id}
            onChange={handleChange}
            error={!!errors.zone_id}
            helperText={errors.zone_id}
            fullWidth
            disabled={isZonesLoading}
          >
            {isZonesLoading ? (
              <MenuItem value="">
                Loading zones...
              </MenuItem>
            ) : (
              zones.map((zone) => (
                <MenuItem
                  key={zone.id}
                  value={zone.id}
                >
                  {zone.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* ============================== */}
          {/* Division Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Division Name"
            placeholder="Example: Sylhet"
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
              isZonesLoading
            }
          >
            {isCreating
              ? 'Saving...'
              : 'Create Division'}
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