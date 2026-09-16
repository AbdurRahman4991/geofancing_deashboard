
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
  useGetSingleDivisionQuery,
  useUpdateDivisionMutation,
} from '../../../../../redux/service/divisionSlice';

import {
  useGetZonesQuery,
} from '../../../../../redux/service/zoneSlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function DivisionUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single Division
  // ==============================

  const {
    data: division,
    isLoading: isFetchingDivision,
    isError: isDivisionError,
  } = useGetSingleDivisionQuery(Number(id), {
    skip: !id,
  });

  // ==============================
  // Get Zones
  // ==============================

  const {
    data: zoneData,
    isLoading: isFetchingZones,
  } = useGetZonesQuery();

  const zones = zoneData?.data ?? [];

  // ==============================
  // Update Division
  // ==============================

  const [
    updateDivision,
    { isLoading: isUpdating },
  ] = useUpdateDivisionMutation();

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

  // ----------------------------------------------------------------------
  // LOAD DIVISION DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (division) {
      console.log('Division data:', division);

      setForm({
        zone_id: String(
          division.zone_id ?? ''
        ),
        name: division.name || '',
        status: division.status ?? 1,
      });
    }
  }, [division]);

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
      zone_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.zone_id) {
      newErrors.zone_id =
        'Zone is required';
    }

    if (!form.name.trim()) {
      newErrors.name =
        'Division name is required';
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
  // UPDATE DIVISION
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Division ID is missing'
      );
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateDivision({
        id: Number(id),

        data: {
          zone_id: Number(
            form.zone_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Division updated successfully!'
      );
    } catch (error: any) {
      console.error(
        'Update division error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update division'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingDivision ||
    isFetchingZones
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading division...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isDivisionError ||
    !division
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load division.
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
        Update Division
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
            helperText={
              errors.zone_id
            }
            fullWidth
          >
            {zones.map((zone) => (
              <MenuItem
                key={zone.id}
                value={zone.id}
              >
                {zone.name}
              </MenuItem>
            ))}
          </TextField>

          {/* ============================== */}
          {/* Division Name */}
          {/* ============================== */}

          <TextField
            label="Division Name"
            name="name"
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
              isFetchingZones
            }
          >
            {isUpdating
              ? 'Updating...'
              : 'Update Division'}
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

