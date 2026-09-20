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
  useGetSingleTerritoryQuery,
  useUpdateTerritoryMutation,
} from '../../../../../redux/service/territorySlice';

import {
  useGetSubDistrictsQuery,
} from '../../../../../redux/service/subDistrictSlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function TerritoryUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single Territory
  // ==============================

  const {
    data: territory,
    isLoading: isFetchingTerritory,
    isError: isTerritoryError,
  } = useGetSingleTerritoryQuery(
    Number(id),
    {
      skip: !id,
    }
  );

  // ==============================
  // Get Sub Districts
  // ==============================

  const {
    data: subDistrictData,
    isLoading: isFetchingSubDistricts,
  } = useGetSubDistrictsQuery();

  const subDistricts =
    subDistrictData?.data ?? [];

  // ==============================
  // Update Territory
  // ==============================

  const [
    updateTerritory,
    { isLoading: isUpdating },
  ] = useUpdateTerritoryMutation();

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    sub_district_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    sub_district_id?: string;
    name?: string;
    status?: string;
  }>({});

  // ----------------------------------------------------------------------
  // LOAD TERRITORY DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (territory) {
      console.log(
        'Territory data:',
        territory
      );

      setForm({
        sub_district_id: String(
          territory.sub_district_id ?? ''
        ),

        name:
          territory.name || '',

        status:
          territory.status ?? 1,
      });
    }
  }, [territory]);

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
      sub_district_id?: string;
      name?: string;
      status?: string;
    } = {};

    // Sub District validation
    if (!form.sub_district_id) {
      newErrors.sub_district_id =
        'Sub District is required';
    }

    // Territory name validation
    if (!form.name.trim()) {
      newErrors.name =
        'Territory name is required';
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
  // UPDATE TERRITORY
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Territory ID is missing'
      );

      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateTerritory({
        id: Number(id),

        data: {
          sub_district_id: Number(
            form.sub_district_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Territory updated successfully!'
      );

    } catch (error: any) {
      console.error(
        'Update territory error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update territory'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingTerritory ||
    isFetchingSubDistricts
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading territory...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isTerritoryError ||
    !territory
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load territory.
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
        Update Territory
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
          {/* Sub District */}
          {/* ============================== */}

          <TextField
            select
            name="sub_district_id"
            label="Sub District"
            value={form.sub_district_id}
            onChange={handleChange}
            error={
              !!errors.sub_district_id
            }
            helperText={
              errors.sub_district_id
            }
            fullWidth
          >

            {subDistricts.map(
              (subDistrict) => (
                <MenuItem
                  key={subDistrict.id}
                  value={subDistrict.id}
                >
                  {subDistrict.name}
                </MenuItem>
              )
            )}

          </TextField>

          {/* ============================== */}
          {/* Territory Name */}
          {/* ============================== */}

          <TextField
            label="Territory Name"
            name="name"
            placeholder="Example: Nakla West Territory"
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
              isFetchingSubDistricts
            }
          >
            {isUpdating
              ? 'Updating...'
              : 'Update Territory'}
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