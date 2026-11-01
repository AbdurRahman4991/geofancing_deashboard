import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from '../../../../../redux/service/categorySlice';

type CategoryForm = {
  company_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

export default function UpdateCategoryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categoryId = Number(id);
  const companyId = getCurrentCompanyId();
  const validCategoryId = Number.isInteger(categoryId) && categoryId > 0;

  const {
    data: category,
    isLoading: isFetchingCategory,
    isError: isCategoryError,
  } = useGetSingleCategoryQuery(
    { id: categoryId, company_id: companyId },
    { skip: !validCategoryId || !companyId }
  );
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({
    page: 1,
    limit: 100,
  });
  const companies = companyResponse?.data ?? [];
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [form, setForm] = useState<CategoryForm>({
    company_id: companyId ? String(companyId) : '',
    name: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!category) return;
    setForm({
      company_id: String(category.company_id),
      name: category.name ?? '',
      description: category.description ?? '',
      status: category.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    });
  }, [category]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.name.trim()) nextErrors.name = 'Category name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!validCategoryId) {
      toast.error('Category ID is missing or invalid');
      return;
    }

    try {
      await updateCategory({
        id: categoryId,
        data: {
          company_id: Number(form.company_id),
          name: form.name.trim(),
          description: form.description.trim() || null,
          status: form.status,
        },
      }).unwrap();
      toast.success('Category updated successfully');
      navigate('/category');
    } catch (error: any) {
      setErrors(error?.data?.errors ?? {});
      toast.error(error?.data?.message || 'Failed to update category');
    }
  };

  if (!validCategoryId) {
    return <DashboardContent><Alert severity="error">Invalid category ID.</Alert></DashboardContent>;
  }

  if (!companyId) {
    return (
      <DashboardContent>
        <Alert severity="error">A company ID is required to load this category.</Alert>
      </DashboardContent>
    );
  }

  if (isFetchingCategory || isCompaniesLoading) {
    return <DashboardContent><Typography>Loading category...</Typography></DashboardContent>;
  }

  if (isCategoryError || !category) {
    return (
      <DashboardContent>
        <Alert severity="error">Unable to load this category.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/category')}>Back to categories</Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Category</Typography>
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
              <MenuItem key={company.id} value={company.id}>{company.company_name}</MenuItem>
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
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as CategoryForm['status'] }))}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating || isCompaniesLoading}>
              {isUpdating ? 'Updating...' : 'Update Category'}
            </Button>
            <Button type="button" onClick={() => navigate('/category')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
