
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
import { isSuperAdmin } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../redux/service/companySlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useCreateRoleMutation } from '../../../../redux/service/roleSlice';

export default function RoleCreateView() {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const isAdmin = isSuperAdmin();
  const { data: companyResponse, isLoading: companiesLoading } = useGetCompanyQuery(
    { page: 1, limit: 100 },
    { skip: !isAdmin }
  );
  const companies = companyResponse?.data ?? [];

  const [form, setForm] = useState({
    name: '',
    company_id: '',
  });

  const [errors, setErrors] = useState<any>({});

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  // -------------------------
  // VALIDATION
  // -------------------------
  const validate = () => {
    const newErrors: any = {};

    if (isAdmin && !form.company_id) {
      newErrors.company_id = 'Company is required';
    }

    if (!form.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = isAdmin
        ? { name: form.name, company_id: Number(form.company_id) }
        : { name: form.name };
      await createRole(payload).unwrap();

      toast.success('Role created successfully');

      setForm({
        name: '',
        company_id: '',
      });

      setErrors({});
    } catch (error: any) {
      toast.error(
        error?.data?.message || 'Failed to create role'
      );
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Role
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack spacing={3}>
          {isAdmin && (
            <TextField
              select
              fullWidth
              required
              name="company_id"
              label="Company"
              value={form.company_id}
              onChange={handleChange}
              error={!!errors.company_id}
              helperText={errors.company_id}
              disabled={companiesLoading}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={String(company.id)}>
                  {company.company_name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            fullWidth
            name="name"
            label="Role Name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading || (isAdmin && companiesLoading)}
          >
            {isLoading ? 'Saving...' : 'Create Role'}
          </Button>

        </Stack>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}