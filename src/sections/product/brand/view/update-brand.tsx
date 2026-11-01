import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetSingleBrandQuery, useUpdateBrandMutation } from '../../../../../redux/service/brandSlice';

type BrandForm = {
  company_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

export default function UpdateBrandView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const brandId = Number(id);
  const companyId = getCurrentCompanyId();
  const validId = Number.isInteger(brandId) && brandId > 0;
  const { data: brand, isLoading: isFetching, isError } = useGetSingleBrandQuery(
    { id: brandId, company_id: companyId },
    { skip: !validId || !companyId }
  );
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [form, setForm] = useState<BrandForm>({
    company_id: companyId ? String(companyId) : '',
    name: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!brand) return;
    setForm({
      company_id: String(brand.company_id),
      name: brand.name ?? '',
      description: brand.description ?? '',
      status: brand.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    });
  }, [brand]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Brand name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await updateBrand({
        id: brandId,
        data: {
          company_id: Number(form.company_id),
          name: form.name.trim(),
          description: form.description.trim() || null,
          status: form.status,
        },
      }).unwrap();
      toast.success('Brand updated successfully');
      navigate('/brand');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to update brand');
    }
  };

  if (!validId) return <DashboardContent><Alert severity="error">Invalid brand ID.</Alert></DashboardContent>;
  if (!companyId) return <DashboardContent><Alert severity="error">A company ID is required.</Alert></DashboardContent>;
  if (isFetching || isCompaniesLoading) return <DashboardContent><Typography>Loading brand...</Typography></DashboardContent>;
  if (isError || !brand) {
    return <DashboardContent><Alert severity="error">Unable to load this brand.</Alert><Button sx={{ mt: 2 }} onClick={() => navigate('/brand')}>Back to brands</Button></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Brand</Typography>
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
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as BrandForm['status'] }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Brand'}
            </Button>
            <Button type="button" onClick={() => navigate('/brand')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}