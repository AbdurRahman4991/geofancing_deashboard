import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetSingleUnitQuery, useUpdateUnitMutation } from '../../../../../redux/service/unitSlice';

type UnitForm = {
  company_id: string;
  unit_name: string;
  short_name: string;
  status: 'active' | 'inactive';
};

export default function UpdateUnitView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const unitId = Number(id);
  const companyId = getCurrentCompanyId();
  const validId = Number.isInteger(unitId) && unitId > 0;
  const { data: unit, isLoading: isFetching, isError } = useGetSingleUnitQuery(
    { id: unitId, company_id: companyId },
    { skip: !validId || !companyId }
  );
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
  const [form, setForm] = useState<UnitForm>({
    company_id: companyId ? String(companyId) : '',
    unit_name: '',
    short_name: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!unit) return;
    setForm({
      company_id: String(unit.company_id),
      unit_name: unit.unit_name ?? '',
      short_name: unit.short_name ?? '',
      status: unit.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    });
  }, [unit]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.unit_name.trim()) nextErrors.unit_name = 'Unit name is required';
    if (!form.short_name.trim()) nextErrors.short_name = 'Short name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await updateUnit({
        id: unitId,
        data: {
          company_id: Number(form.company_id),
          unit_name: form.unit_name.trim(),
          short_name: form.short_name.trim(),
          status: form.status,
        },
      }).unwrap();
      toast.success('Unit updated successfully');
      navigate('/unit');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to update unit');
    }
  };

  if (!validId) return <DashboardContent><Alert severity="error">Invalid unit ID.</Alert></DashboardContent>;
  if (!companyId) return <DashboardContent><Alert severity="error">A company ID is required.</Alert></DashboardContent>;
  if (isFetching || isCompaniesLoading) return <DashboardContent><Typography>Loading unit...</Typography></DashboardContent>;
  if (isError || !unit) {
    return <DashboardContent><Alert severity="error">Unable to load this unit.</Alert><Button sx={{ mt: 2 }} onClick={() => navigate('/unit')}>Back to units</Button></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Unit</Typography>
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
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as UnitForm['status'] }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Unit'}
            </Button>
            <Button type="button" onClick={() => navigate('/unit')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}