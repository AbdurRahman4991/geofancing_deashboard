import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useCreateCategoryMutation } from '../../../../../redux/service/categorySlice';

export default function CreateCategoryView() {
  const navigate = useNavigate();
  const currentCompanyId = getCurrentCompanyId();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });
  const companies = companyResponse?.data ?? [];

  const [form, setForm] = useState({
    company_id: currentCompanyId ? String(currentCompanyId) : '',
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Category name is required';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createCategory({
        company_id: Number(form.company_id),
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
      }).unwrap();
      toast.success('Category created successfully');
      navigate('/category');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to create category');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Category
      </Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            select
            required
            name="company_id"
            label="Company"
            value={form.company_id}
            error={!!errors.company_id}
            helperText={errors.company_id}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, company_id: event.target.value }));
              setErrors((previous) => ({ ...previous, company_id: '' }));
            }}
            disabled={isCompaniesLoading}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.company_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            name="name"
            label="Category name"
            value={form.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, name: event.target.value }));
              setErrors((previous) => ({ ...previous, name: '' }));
            }}
          />

          <TextField
            name="description"
            label="Description"
            multiline
            minRows={3}
            value={form.description}
            onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
          />

          <TextField
            select
            name="status"
            label="Status"
            value={form.status}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, status: event.target.value as 'active' | 'inactive' }))
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" disabled={isLoading || isCompaniesLoading}>
            {isLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
