
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
  useGetSingleDistrictQuery,
  useUpdateDistrictMutation,
} from '../../../../../redux/service/districtSlice';

import {
  useGetDivisionsQuery,
} from '../../../../../redux/service/divisionSlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function DistrictUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single District
  // ==============================

  const {
    data: district,
    isLoading: isFetchingDistrict,
    isError: isDistrictError,
  } = useGetSingleDistrictQuery(Number(id), {
    skip: !id,
  });

  // ==============================
  // Get Divisions
  // ==============================

  const {
    data: divisionData,
    isLoading: isFetchingDivisions,
  } = useGetDivisionsQuery();

  const divisions = divisionData?.data ?? [];

  // ==============================
  // Update District
  // ==============================

  const [
    updateDistrict,
    { isLoading: isUpdating },
  ] = useUpdateDistrictMutation();

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

  // ----------------------------------------------------------------------
  // LOAD DISTRICT DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (district) {
      console.log('District data:', district);

      setForm({
        division_id: String(
          district.division_id ?? ''
        ),
        name: district.name || '',
        status: district.status ?? 1,
      });
    }
  }, [district]);

  // ----------------------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  // ----------------------------------------------------------------------
  // UPDATE DISTRICT
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'District ID is missing'
      );
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateDistrict({
        id: Number(id),

        data: {
          division_id: Number(
            form.division_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'District updated successfully!'
      );
    } catch (error: any) {
      console.error(
        'Update district error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update district'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingDistrict ||
    isFetchingDivisions
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading district...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isDistrictError ||
    !district
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load district.
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
        Update District
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
          >
            {divisions.map((division) => (
              <MenuItem
                key={division.id}
                value={division.id}
              >
                {division.name}
              </MenuItem>
            ))}
          </TextField>

          {/* ============================== */}
          {/* District Name */}
          {/* ============================== */}

          <TextField
            label="District Name"
            name="name"
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
            disabled={
              isUpdating ||
              isFetchingDivisions
            }
          >
            {isUpdating
              ? 'Updating...'
              : 'Update District'}
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
