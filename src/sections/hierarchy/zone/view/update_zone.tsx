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
  useGetSingleZoneQuery,
  useUpdateZoneMutation,
} from '../../../../../redux/service/zoneSlice';

import {
  useGetRegionsQuery,
} from '../../../../../redux/service/regionSlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function ZoneUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single Zone
  // ==============================

  const {
    data: zone,
    isLoading: isFetchingZone,
    isError: isZoneError,
  } = useGetSingleZoneQuery(Number(id), {
    skip: !id,
  });

  // ==============================
  // Get Regions
  // ==============================

  const {
    data: regionData,
    isLoading: isFetchingRegions,
  } = useGetRegionsQuery();

  const regions = regionData?.data ?? [];

  // ==============================
  // Update Zone
  // ==============================

  const [
    updateZone,
    { isLoading: isUpdating },
  ] = useUpdateZoneMutation();

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

  const [errors, setErrors] = useState({});

  // ----------------------------------------------------------------------
  // LOAD ZONE DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (zone) {
      console.log('Zone data:', zone);

      setForm({
        region_id: String(
          zone.region_id ?? ''
        ),
        name: zone.name || '',
        status: zone.status ?? 1,
      });
    }
  }, [zone]);

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

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ----------------------------------------------------------------------
  // UPDATE ZONE
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Zone ID is missing'
      );
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateZone({
        id: Number(id),

        data: {
          region_id: Number(
            form.region_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Zone updated successfully!'
      );
    } catch (error) {
      console.error(
        'Update zone error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update zone'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingZone ||
    isFetchingRegions
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading zone...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isZoneError ||
    !zone
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load zone.
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
        Update Zone
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
            helperText={
              errors.region_id
            }
            fullWidth
          >
            {regions.map((region) => (
              <MenuItem
                key={region.id}
                value={region.id}
              >
                {region.name}
              </MenuItem>
            ))}
          </TextField>

          {/* ============================== */}
          {/* Zone Name */}
          {/* ============================== */}

          <TextField
            label="Zone Name"
            name="name"
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
              : 'Update Zone'}
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