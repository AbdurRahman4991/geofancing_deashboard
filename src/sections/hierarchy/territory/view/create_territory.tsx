
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
  useCreateTerritoryMutation,
} from '../../../../../redux/service/territorySlice';

import {
  useGetSubDistrictsQuery,
} from '../../../../../redux/service/subDistrictSlice';

// ----------------------------------------------------------------------

export default function TerritoryCreateView() {

  // ==============================
  // Territory API
  // ==============================

  const [
    createTerritory,
    { isLoading: isCreating },
  ] = useCreateTerritoryMutation();

  // ==============================
  // Sub District API
  // ==============================

  const {
    data: subDistrictData,
    isLoading: isSubDistrictsLoading,
  } = useGetSubDistrictsQuery();

  const subDistricts =
    subDistrictData?.data ?? [];

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
        name === 'sub_district_id'
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

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      await createTerritory({
        sub_district_id: Number(
          form.sub_district_id
        ),

        name: form.name.trim(),

        status: form.status,
      }).unwrap();

      // ==============================
      // Success
      // ==============================

      toast.success(
        'Territory created successfully'
      );

      // ==============================
      // Reset Form
      // ==============================

      setForm({
        sub_district_id: '',
        name: '',
        status: 1,
      });

      setErrors({});

    } catch (err: any) {

      console.error(
        'Create territory error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create territory'
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
        Create Territory
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
            disabled={
              isSubDistrictsLoading
            }
          >

            {isSubDistrictsLoading ? (

              <MenuItem value="">
                Loading sub districts...
              </MenuItem>

            ) : (

              subDistricts.map(
                (subDistrict) => (

                  <MenuItem
                    key={subDistrict.id}
                    value={subDistrict.id}
                  >
                    {subDistrict.name}
                  </MenuItem>

                )
              )

            )}

          </TextField>

          {/* ============================== */}
          {/* Territory Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Territory Name"
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
              isSubDistrictsLoading
            }
          >

            {isCreating
              ? 'Saving...'
              : 'Create Territory'}

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

