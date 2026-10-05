import { useEffect, useState } from 'react';

import { Box, Card, Stack, TextField, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from '../../../../redux/service/userSlice';
import type { UpdateUserRequest } from '../../../../redux/service/userSlice';

type FormState = UpdateUserRequest & {
  password_confirmation: string;
};
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  email: '',
  password: '',
  password_confirmation: '',
};

export default function UserUpdateView() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isFetching, isError: fetchFailed } = useGetSingleUserQuery(id || '', {
    skip: !id,
  });
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (data) {
      setForm({
        email: data.email || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    if (form.password && !form.password_confirmation) {
      nextErrors.password_confirmation = 'Please confirm the new password';
    } else if (form.password && form.password !== form.password_confirmation) {
      nextErrors.password_confirmation = 'Passwords do not match';
    } else if (!form.password && form.password_confirmation) {
      nextErrors.password_confirmation = 'Enter a new password first';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !validate()) return;

    const data: UpdateUserRequest = {
      email: form.email.trim(),
      ...(form.password
        ? {
            password: form.password,
            password_confirmation: form.password_confirmation,
          }
        : {}),
    };

    try {
      await updateUser({ id, data }).unwrap();
      toast.success('User updated successfully');
      setForm((current) => ({ ...current, password: '', password_confirmation: '' }));
      setErrors({});
    } catch (error: any) {
      const validationErrors = error?.data?.errors as Record<string, string[]> | undefined;
      if (validationErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(validationErrors).map(([field, messages]) => [field, messages[0]])
          ) as FormErrors
        );
      }
      toast.error(error?.data?.message || 'Failed to update user');
    }
  };

  if (isFetching) return <p>Loading user...</p>;
  if (fetchFailed || !data) return <p>Unable to load this user.</p>;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update User
      </Typography>

      <Card sx={{ p: 3, maxWidth: 700 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Employee"
              value={data.employee?.name || '—'}
              helperText={data.employee?.employee_id || 'Employee code unavailable'}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              fullWidth
            />

            <TextField
              name="password"
              label="New Password (optional)"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Leave blank to keep the current password'}
              fullWidth
            />

            <TextField
              name="password_confirmation"
              label="Confirm New Password"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              color="inherit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </Stack>
        </Box>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}