import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  MenuItem,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  useUpdateCompanyMutation,
  useGetSingleCompanyQuery,
} from '../../../../redux/service/companySlice';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyUpdateView() {
  const { id } = useParams();

  const {
    data,
    isLoading: isFetching,
  } = useGetSingleCompanyQuery(id);

  const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

  const [form, setForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    package: '',
    details: '',
    billing_cycle: '',
    status: 1,
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<any>({});
  const [preview, setPreview] = useState<string | null>(null);

  // ================================
  // LOAD EXISTING COMPANY DATA
  // ================================
  useEffect(() => {
    if (data) {
      setForm({
        company_name: data.company_name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        package: data.package || '',
        details: data.details || '',
        billing_cycle: data.billing_cycle || '',
        status: data.status ?? 1,
        avatar: null,
      });

      setPreview(data.avatar_url || data.avatar || null);
    }
  }, [data]);

  // ================================
  // IMAGE CHANGE
  // ================================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm((prev) => ({
        ...prev,
        avatar: file,
      }));

      setPreview(URL.createObjectURL(file));

      setErrors((prev: any) => ({
        ...prev,
        avatar: '',
      }));
    }
  };

  // ================================
  // INPUT CHANGE
  // ================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: '',
    }));
  };

  // ================================
  // VALIDATION
  // ================================
  const validate = () => {
    const newErrors: any = {};

    if (!form.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(form.phone)) {
      newErrors.phone = 'Phone must be 10–15 digits';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!form.package) {
      newErrors.package = 'Package is required';
    }

    if (!form.details.trim()) {
      newErrors.details = 'Details are required';
    }

    if (!form.billing_cycle) {
      newErrors.billing_cycle = 'Billing cycle is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append('company_name', form.company_name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('address', form.address);

    formData.append('package', form.package);
    formData.append('details', form.details);
    formData.append(
      'billing_cycle',
      form.billing_cycle
    );

    formData.append(
      'status',
      String(form.status)
    );

    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }

    try {
      await updateCompany({
        id,
        data: formData,
      }).unwrap();

      toast.success('Company updated successfully!');
    } catch (err: any) {
      if (err?.data?.errors) {
        setErrors(err.data.errors);
      } else {
        toast.error(
          err?.data?.message || 'Failed to update company'
        );
      }
    }
  };

  // ================================
  // LOADING
  // ================================
  if (isFetching) {
    return (
      <Typography sx={{ p: 3 }}>
        Loading company...
      </Typography>
    );
  }

  // ================================
  // UI
  // ================================
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Company
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={2}>

          {/* =========================
              IMAGE
          ========================== */}
          <Stack
            spacing={1}
            alignItems="center"
          >
            <Avatar
              src={preview || ''}
              sx={{
                width: 120,
                height: 120,
                border: '2px solid #ccc',
              }}
            />

            <Button
              variant="outlined"
              component="label"
            >
              Change Avatar

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {errors.avatar && (
              <Typography
                color="error"
                variant="caption"
              >
                {errors.avatar}
              </Typography>
            )}
          </Stack>

          {/* =========================
              COMPANY NAME
          ========================== */}
          <TextField
            name="company_name"
            label="Company Name"
            value={form.company_name}
            error={!!errors.company_name}
            helperText={errors.company_name}
            onChange={handleChange}
            fullWidth
          />

          {/* =========================
              EMAIL
          ========================== */}
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={handleChange}
            fullWidth
          />

          {/* =========================
              PHONE
          ========================== */}
          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');

              if (value.length <= 15) {
                setForm((prev) => ({
                  ...prev,
                  phone: value,
                }));

                setErrors((prev: any) => ({
                  ...prev,
                  phone: '',
                }));
              }
            }}
            inputProps={{
              maxLength: 15,
            }}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          {/* =========================
              ADDRESS
          ========================== */}
          <TextField
            name="address"
            label="Address"
            value={form.address}
            error={!!errors.address}
            helperText={errors.address}
            onChange={handleChange}
            fullWidth
          />

          {/* =========================
              PACKAGE
          ========================== */}
          <TextField
            select
            name="package"
            label="Package"
            value={form.package}
            error={!!errors.package}
            helperText={errors.package}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="basic">
              Basic
            </MenuItem>

            <MenuItem value="standard">
              Standard
            </MenuItem>

            <MenuItem value="premium">
              Premium
            </MenuItem>

            <MenuItem value="enterprise">
              Enterprise
            </MenuItem>
          </TextField>

          {/* =========================
              DETAILS
          ========================== */}
          <TextField
            name="details"
            label="Details"
            value={form.details}
            error={!!errors.details}
            helperText={errors.details}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="Write company/package details..."
          />

          {/* =========================
              BILLING CYCLE
          ========================== */}
          <TextField
            select
            name="billing_cycle"
            label="Billing Cycle"
            value={form.billing_cycle}
            error={!!errors.billing_cycle}
            helperText={errors.billing_cycle}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="monthly">
              Monthly
            </MenuItem>

            <MenuItem value="quarterly">
              Quarterly
            </MenuItem>

            <MenuItem value="yearly">
              Yearly
            </MenuItem>
          </TextField>

          {/* =========================
              STATUS
          ========================== */}
          <TextField
            select
            name="status"
            label="Status"
            value={form.status}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                status: Number(e.target.value),
              }));

              setErrors((prev: any) => ({
                ...prev,
                status: '',
              }));
            }}
            fullWidth
          >
            <MenuItem value={1}>
              Active
            </MenuItem>

            <MenuItem value={0}>
              Inactive
            </MenuItem>
          </TextField>

          {/* =========================
              UPDATE BUTTON
          ========================== */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            color="inherit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? 'Updating...'
              : 'Update Company'}
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
