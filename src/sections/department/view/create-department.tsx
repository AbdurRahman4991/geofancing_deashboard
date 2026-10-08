import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateDepartmentMutation } from '../../../../redux/service/departmentsSlice';
import { useGetCompanyQuery } from '../../../../redux/service/companySlice';
import { toast } from 'react-toastify';

export default function DepartmentCreateView() {
  const navigate = useNavigate();
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();
  const { data: companyResponse } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const [form, setForm] = useState({ company_id: '', name: '', description: '', status: 'active' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Department name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await createDepartment({ company_id: Number(form.company_id), name: form.name.trim(), description: form.description.trim() || null, status: form.status }).unwrap();
      toast.success('Department created successfully');
      navigate('/department');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to create department');
    }
  };

  return <DashboardContent><Typography variant="h4" sx={{ mb: 3 }}>Create Department</Typography><Card sx={{ p: 3, maxWidth: 600 }}><Stack component="form" spacing={2} onSubmit={handleSubmit}>
    <TextField select required name="company_id" label="Company" value={form.company_id} error={!!errors.company_id} helperText={errors.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
      {companies.map((company: any) => <MenuItem key={company.id} value={company.id}>{company.company_name}</MenuItem>)}
    </TextField>
    <TextField required name="name" label="Department name" value={form.name} error={!!errors.name} helperText={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
    <TextField name="description" label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
    <TextField select name="status" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></TextField>
    <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Department'}</Button>
  </Stack></Card></DashboardContent>;
}
