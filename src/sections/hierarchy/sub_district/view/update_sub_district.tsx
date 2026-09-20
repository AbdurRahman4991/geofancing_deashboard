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
  useGetSingleSubDistrictQuery,
  useUpdateSubDistrictMutation,
} from '../../../../../redux/service/subDistrictSlice';

import {
  useGetDistrictsQuery,
} from '../../../../../redux/service/districtSlice';

import {
  toast,
  ToastContainer,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function SubDistrictUpdateView() {
  const { id } = useParams();

  // ==============================
  // Get Single SubDistrict
  // ==============================

  const {
    data: subDistrict,
    isLoading: isFetchingSubDistrict,
    isError: isSubDistrictError,
  } = useGetSingleSubDistrictQuery(
    Number(id),
    {
      skip: !id,
    }
  );

  // ==============================
  // Get Districts
  // ==============================

  const {
    data: districtData,
    isLoading: isFetchingDistricts,
  } = useGetDistrictsQuery();

  const districts =
    districtData?.data ?? [];

  // ==============================
  // Update SubDistrict
  // ==============================

  const [
    updateSubDistrict,
    { isLoading: isUpdating },
  ] = useUpdateSubDistrictMutation();

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

  // ----------------------------------------------------------------------
  // LOAD SUB DISTRICT DATA
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (subDistrict) {
      console.log(
        'Sub District data:',
        subDistrict
      );

      setForm({
        district_id: String(
          subDistrict.district_id ?? ''
        ),

        name:
          subDistrict.name || '',

        status:
          subDistrict.status ?? 1,
      });
    }
  }, [subDistrict]);

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

  // ----------------------------------------------------------------------
  // UPDATE SUB DISTRICT
  // ----------------------------------------------------------------------

  const handleSubmit = async () => {
    if (!id) {
      toast.error(
        'Sub District ID is missing'
      );

      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await updateSubDistrict({
        id: Number(id),

        data: {
          district_id: Number(
            form.district_id
          ),

          name: form.name.trim(),

          status: form.status,
        },
      }).unwrap();

      toast.success(
        'Sub District updated successfully!'
      );

    } catch (error: any) {
      console.error(
        'Update sub district error:',
        error
      );

      toast.error(
        error?.data?.message ||
          'Failed to update sub district'
      );
    }
  };

  // ----------------------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------------------

  if (
    isFetchingSubDistrict ||
    isFetchingDistricts
  ) {
    return (
      <DashboardContent>
        <Typography>
          Loading sub district...
        </Typography>
      </DashboardContent>
    );
  }

  // ----------------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------------

  if (
    isSubDistrictError ||
    !subDistrict
  ) {
    return (
      <DashboardContent>
        <Typography color="error">
          Failed to load sub district.
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
        Update Sub District
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
          >

            {districts.map((district) => (
              <MenuItem
                key={district.id}
                value={district.id}
              >
                {district.name}
              </MenuItem>
            ))}

          </TextField>

          {/* ============================== */}
          {/* Sub District Name */}
          {/* ============================== */}

          <TextField
            label="Sub District Name"
            name="name"
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
              isFetchingDistricts
            }
          >
            {isUpdating
              ? 'Updating...'
              : 'Update Sub District'}
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
