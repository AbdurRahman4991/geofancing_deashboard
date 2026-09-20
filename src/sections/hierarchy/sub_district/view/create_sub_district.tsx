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
  useCreateSubDistrictMutation,
} from '../../../../../redux/service/subDistrictSlice';

import {
  useGetDistrictsQuery,
} from '../../../../../redux/service/districtSlice';

// ----------------------------------------------------------------------

export default function SubDistrictCreateView() {

  // ==============================
  // SubDistrict API
  // ==============================

  const [
    createSubDistrict,
    { isLoading: isCreating },
  ] = useCreateSubDistrictMutation();

  // ==============================
  // District API
  // ==============================

  const {
    data: districtData,
    isLoading: isDistrictsLoading,
  } = useGetDistrictsQuery();

  const districts =
    districtData?.data ?? [];

  // ==============================
  // Form
  // ==============================

  const [form, setForm] = useState({
    district_id: '',
    name: '',
    status: 1,
  });

  // ==============================
  // Errors
  // ==============================

  const [errors, setErrors] = useState<{
    district_id?: string;
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
        name === 'district_id'
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
      district_id?: string;
      name?: string;
      status?: string;
    } = {};

    if (!form.district_id) {
      newErrors.district_id =
        'District is required';
    }

    if (!form.name.trim()) {
      newErrors.name =
        'Sub District name is required';
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

      await createSubDistrict({
        district_id: Number(
          form.district_id
        ),
        name: form.name.trim(),
        status: form.status,
      }).unwrap();

      toast.success(
        'Sub District created successfully'
      );

      // Reset form

      setForm({
        district_id: '',
        name: '',
        status: 1,
      });

      setErrors({});

    } catch (err: any) {

      console.error(
        'Create sub district error:',
        err
      );

      toast.error(
        err?.data?.message ||
          'Failed to create sub district'
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
        Create Sub District
      </Typography>

      <Card
        sx={{
          p: 3,
          maxWidth: 600,
        }}
      >

        <Stack spacing={2}>

          {/* ============================== */}
          {/* District */}
          {/* ============================== */}

          <TextField
            select
            name="district_id"
            label="District"
            value={form.district_id}
            onChange={handleChange}
            error={!!errors.district_id}
            helperText={
              errors.district_id
            }
            fullWidth
            disabled={
              isDistrictsLoading
            }
          >

            {isDistrictsLoading ? (

              <MenuItem value="">
                Loading districts...
              </MenuItem>

            ) : (

              districts.map((district) => (

                <MenuItem
                  key={district.id}
                  value={district.id}
                >
                  {district.name}
                </MenuItem>

              ))

            )}

          </TextField>

          {/* ============================== */}
          {/* Sub District Name */}
          {/* ============================== */}

          <TextField
            name="name"
            label="Sub District Name"
            placeholder="Example: Nageshwari"
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
              isDistrictsLoading
            }
          >

            {isCreating
              ? 'Saving...'
              : 'Create Sub District'}

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
