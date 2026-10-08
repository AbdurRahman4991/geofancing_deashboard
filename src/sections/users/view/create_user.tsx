import { useState } from 'react';

import { Box, Card, Stack, TextField, Button, Typography, Autocomplete } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateUserMutation } from '../../../../redux/service/userSlice';
import type { CreateUserRequest } from '../../../../redux/service/userSlice';
import { useGetEmployeesQuery } from '../../../../redux/service/employeeSlice';

type FormErrors = Partial<Record<keyof CreateUserRequest, string>>;

const initialForm: CreateUserRequest = {
  employee_id: '',
  email: '',
  password: '',
  password_confirmation: '',
};

export default function UserCreateView() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: employeeResponse, isLoading: employeesLoading } = useGetEmployeesQuery({ page: 1, per_page: 100 });
  const employees = employeeResponse?.data ?? [];
  const [form, setForm] = useState<CreateUserRequest>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.employee_id.trim()) {
      nextErrors.employee_id = 'Employee ID is required';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    if (!form.password_confirmation) {
      nextErrors.password_confirmation = 'Please confirm the password';
    } else if (form.password !== form.password_confirmation) {
      nextErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await createUser({
        ...form,
        employee_id: form.employee_id.trim(),
        email: form.email.trim(),
      }).unwrap();

      toast.success(response.message || 'User registered successfully');
      setForm(initialForm);
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

      toast.error(error?.data?.message || 'Failed to register user');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Register User
      </Typography>

      <Card sx={{ p: 3, maxWidth: 700 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Autocomplete
              options={employees}
              value={employees.find((employee) => String(employee.employee_id) === form.employee_id) ?? null}
              loading={employeesLoading}
              onChange={(_, employee) => {
                setForm((current) => ({ ...current, employee_id: employee ? String(employee.employee_id) : '' }));
                setErrors((current) => ({ ...current, employee_id: undefined }));
              }}
              getOptionLabel={(employee) => `${employee.name} (${employee.employee_id})`}
              isOptionEqualToValue={(option, value) => String(option.employee_id) === String(value.employee_id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="employee_id"
                  label="Employee"
                  placeholder="Search employee..."
                  error={!!errors.employee_id}
                  helperText={errors.employee_id || 'Select an employee for this user'}
                  required
                  fullWidth
                />
              )}
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
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Use at least 8 characters'}
              required
              fullWidth
            />

            <TextField
              name="password_confirmation"
              label="Confirm Password"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              required
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
              {isLoading ? 'Registering...' : 'Register User'}
            </Button>
          </Stack>
        </Box>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
