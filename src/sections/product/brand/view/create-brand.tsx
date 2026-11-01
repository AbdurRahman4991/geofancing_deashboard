import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useCreateBrandMutation } from '../../../../../redux/service/brandSlice';

export default function CreateBrandView() {
  const navigate = useNavigate();
  const currentCompanyId = getCurrentCompanyId();
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
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
    if (!form.name.trim()) nextErrors.name = 'Brand name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createBrand({
        company_id: Number(form.company_id),
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
      }).unwrap();
      toast.success('Brand created successfully');
      navigate('/brand');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to create brand');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Brand</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            select required name="company_id" label="Company" value={form.company_id}
            error={!!errors.company_id} helperText={errors.company_id} disabled={isCompaniesLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, company_id: event.target.value }));
              setErrors((previous) => ({ ...previous, company_id: '' }));
            }}
          >
            {companies.map((company) => <MenuItem key={company.id} value={company.id}>{company.company_name}</MenuItem>)}
          </TextField>
          <TextField
            required name="name" label="Brand name" value={form.name}
            error={!!errors.name} helperText={errors.name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, name: event.target.value }));
              setErrors((previous) => ({ ...previous, name: '' }));
            }}
          />
          <TextField
            name="description" label="Description" multiline minRows={3} value={form.description}
            onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
          />
          <TextField
            select name="status" label="Status" value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as 'active' | 'inactive' }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" disabled={isLoading || isCompaniesLoading}>
            {isLoading ? 'Creating...' : 'Create Brand'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}