
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
  useCreateDistrictMutation,
} from '../../../../../redux/service/districtSlice';

import {
  useGetDivisionsQuery,
} from '../../../../../redux/service/divisionSlice';

// ----------------------------------------------------------------------

export default function DistrictCreateView() {
  // ==============================
  // District API
  // ==============================

  const [
    createDistrict,
    { isLoading: isCreating },
  ] = useCreateDistrictMutation();

  // ==============================
  // Division API
  // ==============================

  const {
    data: divisionData,
    isLoading: isDivisionsLoading,
  } = useGetDivisionsQuery();

  const divisions =
    divisionData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    division_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    division_id?: string;
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
        name === 'division_id'
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
      division_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.division_id) {
      newErrors.division_id =
        'Division is required';
    }

    if (!form.name.trim()) {
      newErrors.name =
        'District name is required';
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

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createDistrict({
        division_id: Number(
          form.division_id
        ),
        name: form.name.trim(),
        status: form.status,
      }).unwrap();

      toast.success(
        'District created successfully'
      );

      // Reset form

      setForm({
        division_id: '',
        name: '',
        status: 1,
      });

      setErrors({});
    } catch (err: any) {
      console.error(
        'Create district error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create district'
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
        Create District
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >
        <Stack spacing={2}>

          {/* ============================== */}
          {/* Division */}
          {/* ============================== */}

          <TextField
            select
            name="division_id"
            label="Division"
            value={form.division_id}
            onChange={handleChange}
            error={!!errors.division_id}
            helperText={
              errors.division_id
            }
            fullWidth
            disabled={
              isDivisionsLoading
            }
          >
            {isDivisionsLoading ? (
              <MenuItem value="">
                Loading divisions...
              </MenuItem>
            ) : (
              divisions.map((division) => (
                <MenuItem
                  key={division.id}
                  value={division.id}
                >
                  {division.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* ============================== */}
          {/* District Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="District Name"
            placeholder="Example: Habiganj"
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
              isDivisionsLoading
            }
          >
            {isCreating
              ? 'Saving...'
              : 'Create District'}
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

