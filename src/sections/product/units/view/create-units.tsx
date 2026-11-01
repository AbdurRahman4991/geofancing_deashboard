import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useCreateUnitMutation } from '../../../../../redux/service/unitSlice';

export default function CreateUnitView() {
  const navigate = useNavigate();
  const currentCompanyId = getCurrentCompanyId();
  const [createUnit, { isLoading }] = useCreateUnitMutation();
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const [form, setForm] = useState({
    company_id: currentCompanyId ? String(currentCompanyId) : '',
    unit_name: '',
    short_name: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.unit_name.trim()) nextErrors.unit_name = 'Unit name is required';
    if (!form.short_name.trim()) nextErrors.short_name = 'Short name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await createUnit({
        company_id: Number(form.company_id),
        unit_name: form.unit_name.trim(),
        short_name: form.short_name.trim(),
        status: form.status,
      }).unwrap();
      toast.success('Unit created successfully');
      navigate('/unit');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to create unit');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Unit</Typography>
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
            required name="unit_name" label="Unit name" value={form.unit_name}
            error={!!errors.unit_name} helperText={errors.unit_name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, unit_name: event.target.value }));
              setErrors((previous) => ({ ...previous, unit_name: '' }));
            }}
          />
          <TextField
            required name="short_name" label="Short name" value={form.short_name}
            error={!!errors.short_name} helperText={errors.short_name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, short_name: event.target.value }));
              setErrors((previous) => ({ ...previous, short_name: '' }));
            }}
          />
          <TextField
            select name="status" label="Status" value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as 'active' | 'inactive' }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" disabled={isLoading || isCompaniesLoading}>
            {isLoading ? 'Creating...' : 'Create Unit'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}