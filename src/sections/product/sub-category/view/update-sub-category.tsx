import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetCategoriesQuery } from '../../../../../redux/service/categorySlice';
import {
  useGetSingleSubCategoryQuery,
  useUpdateSubCategoryMutation,
} from '../../../../../redux/service/subCategorySlice';

type SubCategoryForm = {
  company_id: string;
  category_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

export default function UpdateSubCategoryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subCategoryId = Number(id);
  const companyId = getCurrentCompanyId();
  const validId = Number.isInteger(subCategoryId) && subCategoryId > 0;
  const {
    data: subCategory,
    isLoading: isFetching,
    isError,
  } = useGetSingleSubCategoryQuery(
    { id: subCategoryId, company_id: companyId },
    { skip: !validId || !companyId }
  );
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
  const [form, setForm] = useState<SubCategoryForm>({
    company_id: companyId ? String(companyId) : '',
    category_id: '',
    name: '',
    description: '',
    status: 'active',
  });
  const selectedCompanyId = Number(form.company_id);
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useGetCategoriesQuery(
    { company_id: selectedCompanyId, page: 1, per_page: 100 },
    { skip: !selectedCompanyId }
  );
  const categories = categoryResponse?.data.data ?? [];
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!subCategory) return;
    setForm({
      company_id: String(subCategory.company_id),
      category_id: String(subCategory.category_id),
      name: subCategory.name ?? '',
      description: subCategory.description ?? '',
      status: subCategory.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    });
  }, [subCategory]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.category_id) nextErrors.category_id = 'Category is required';
    if (!form.name.trim()) nextErrors.name = 'Sub-category name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await updateSubCategory({
        id: subCategoryId,
        data: {
          company_id: Number(form.company_id),
          category_id: Number(form.category_id),
          name: form.name.trim(),
          description: form.description.trim() || null,
          status: form.status,
        },
      }).unwrap();
      toast.success('Sub-category updated successfully');
      navigate('/sub-category');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to update sub-category');
    }
  };

  if (!validId) return <DashboardContent><Alert severity="error">Invalid sub-category ID.</Alert></DashboardContent>;
  if (!companyId) return <DashboardContent><Alert severity="error">A company ID is required.</Alert></DashboardContent>;
  if (isFetching || isCompaniesLoading) return <DashboardContent><Typography>Loading sub-category...</Typography></DashboardContent>;
  if (isError || !subCategory) {
    return <DashboardContent><Alert severity="error">Unable to load this sub-category.</Alert><Button sx={{ mt: 2 }} onClick={() => navigate('/sub-category')}>Back to sub-categories</Button></DashboardContent>;
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Sub-category</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            select required name="company_id" label="Company" value={form.company_id}
            error={!!errors.company_id} helperText={errors.company_id} disabled={isCompaniesLoading}
            onChange={(event) => setForm((previous) => ({ ...previous, company_id: event.target.value, category_id: '' }))}
          >
            {companies.map((company) => <MenuItem key={company.id} value={company.id}>{company.company_name}</MenuItem>)}
          </TextField>
          <TextField
            select required name="category_id" label="Parent category" value={form.category_id}
            error={!!errors.category_id} helperText={errors.category_id}
            disabled={!form.company_id || isCategoriesLoading}
            onChange={(event) => setForm((previous) => ({ ...previous, category_id: event.target.value }))}
          >
            {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
          </TextField>
          <TextField
            required name="name" label="Sub-category name" value={form.name}
            error={!!errors.name} helperText={errors.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
          />
          <TextField
            name="description" label="Description" multiline minRows={3} value={form.description}
            onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
          />
          <TextField
            select name="status" label="Status" value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as SubCategoryForm['status'] }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating || isCategoriesLoading}>
              {isUpdating ? 'Updating...' : 'Update Sub-category'}
            </Button>
            <Button type="button" onClick={() => navigate('/sub-category')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}