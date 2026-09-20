
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
  useGetSingleAreaQuery,
  useUpdateAreaMutation,
} from '../../../../../redux/service/areaSlice';

import {
  useGetTerritoriesQuery,
} from '../../../../../redux/service/territorySlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function AreaUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single Area
  // ==============================

  const {
    data: area,
    isLoading: isFetchingArea,
    isError: isAreaError,
  } = useGetSingleAreaQuery(
    Number(id),
    {
      skip: !id,
    }
  );

  // ==============================
  // Get Territories
  // ==============================

  const {
    data: territoryData,
    isLoading: isFetchingTerritories,
  } = useGetTerritoriesQuery();

  const territories =
    territoryData?.data ?? [];

  // ==============================
  // Update Area
  // ==============================

  const [
    updateArea,
    { isLoading: isUpdating },
  ] = useUpdateAreaMutation();

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

  // ----------------------------------------------------------------------
  // LOAD AREA DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (area) {
      console.log(
        'Area data:',
        area
      );

      setForm({
        territory_id: String(
          area.territory_id ?? ''
        ),

        name:
          area.name || '',

        status:
          area.status ?? 1,
      });
    }
  }, [area]);

  // ----------------------------------------------------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------------------------------------------------

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

  // ----------------------------------------------------------------------
  // UPDATE AREA
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Area ID is missing'
      );

      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateArea({
        id: Number(id),

        data: {
          territory_id: Number(
            form.territory_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Area updated successfully!'
      );

    } catch (error: any) {
      console.error(
        'Update area error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update area'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingArea ||
    isFetchingTerritories
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading area...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isAreaError ||
    !area
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load area.
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------

  return (
    <DashboardContent>

      {/* ============================== */}
      {/* Page Title */}
      {/* ============================== */}

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Update Area
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
              isFetchingTerritories
            }
          >

            {territories.map(
              (territory) => (
                <MenuItem
                  key={territory.id}
                  value={territory.id}
                >
                  {territory.name}
                </MenuItem>
              )
            )}

          </TextField>

          {/* ============================== */}
          {/* Area Name */}
          {/* ============================== */}

          <TextField
            label="Area Name"
            name="name"
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
              isFetchingTerritories
            }
          >
            {isUpdating
              ? 'Updating...'
              : 'Update Area'}
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
