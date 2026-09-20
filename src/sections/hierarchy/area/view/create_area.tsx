
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
  useCreateAreaMutation,
} from '../../../../../redux/service/areaSlice';

import {
  useGetTerritoriesQuery,
} from '../../../../../redux/service/territorySlice';

// ----------------------------------------------------------------------

export default function AreaCreateView() {

  // ==============================
  // Area API
  // ==============================

  const [
    createArea,
    { isLoading: isCreating },
  ] = useCreateAreaMutation();

  // ==============================
  // Territory API
  // ==============================

  const {
    data: territoryData,
    isLoading: isTerritoriesLoading,
  } = useGetTerritoriesQuery();

  const territories =
    territoryData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    territory_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    territory_id?: string;
    name?: string;
    status?: string;
  }>({});

  // ==============================
  // Handle Change
  // ==============================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === 'territory_id'
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
      territory_id?: string;
      name?: string;
      status?: string;
    } = {};

    // Territory validation
    if (!form.territory_id) {
      newErrors.territory_id =
        'Territory is required';
    }

    // Area name validation
    if (!form.name.trim()) {
      newErrors.name =
        'Area name is required';
    }

    // Status validation
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

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      await createArea({
        territory_id: Number(
          form.territory_id
        ),

        name: form.name.trim(),

        status: form.status,
      }).unwrap();

      // ==============================
      // Success
      // ==============================

      toast.success(
        'Area created successfully'
      );

      // ==============================
      // Reset Form
      // ==============================

      setForm({
        territory_id: '',
        name: '',
        status: 1,
      });

      setErrors({});

    } catch (err: any) {

      console.error(
        'Create area error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create area'
      );
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <DashboardContent>

      {/* ============================== */}
      {/* Page Title */}
      {/* ============================== */}

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Create Area
      </Typography>

      {/* ============================== */}
      {/* Form Card */}
      {/* ============================== */}

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >

        <Stack spacing={2}>

          {/* ============================== */}
          {/* Territory */}
          {/* ============================== */}

          <TextField
            select
            name="territory_id"
            label="Territory"
            value={form.territory_id}
            onChange={handleChange}
            error={
              !!errors.territory_id
            }
            helperText={
              errors.territory_id
            }
            fullWidth
            disabled={
              isTerritoriesLoading
            }
          >

            {isTerritoriesLoading ? (

              <MenuItem value="">
                Loading territories...
              </MenuItem>

            ) : (

              territories.map(
                (territory) => (

                  <MenuItem
                    key={territory.id}
                    value={territory.id}
                  >
                    {territory.name}
                  </MenuItem>

                )
              )

            )}

          </TextField>

          {/* ============================== */}
          {/* Area Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Area Name"
            placeholder="Example: Nalitabari West Area"
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
              isTerritoriesLoading
            }
          >

            {isCreating
              ? 'Saving...'
              : 'Create Area'}

          </Button>

        </Stack>

      </Card>

      {/* ============================== */}
      {/* Toast */}
      {/* ============================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </DashboardContent>
  );
}
