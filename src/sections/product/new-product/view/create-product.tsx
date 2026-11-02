import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCategoriesQuery } from '../../../../../redux/service/categorySlice';
import { useGetCompanyQuery } from '../../../../../redux/service/companySlice';
import { useGetBrandsQuery } from '../../../../../redux/service/brandSlice';
import { useGetUnitsQuery } from '../../../../../redux/service/unitSlice';
import { useCreateProductMutation } from '../../../../../redux/service/productSlice';

export default function CreateProductView() {
  const navigate = useNavigate();
  const currentCompanyId = getCurrentCompanyId();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: companyResponse, isLoading: isCompaniesLoading } = useGetCompanyQuery({ page: 1, limit: 100 });
  const companies = companyResponse?.data ?? [];
  const companyId = Number(currentCompanyId);
  const hasCompanyId = Number.isInteger(companyId) && companyId > 0;
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useGetCategoriesQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !hasCompanyId }
  );
  const { data: brandResponse, isLoading: isBrandsLoading } = useGetBrandsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !hasCompanyId }
  );
  const { data: unitResponse, isLoading: isUnitsLoading } = useGetUnitsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !hasCompanyId }
  );
  const categories = categoryResponse?.data.data ?? [];
  const brands = brandResponse?.data.data ?? [];
  const units = unitResponse?.data.data ?? [];
  const [form, setForm] = useState({
    company_id: currentCompanyId ? String(currentCompanyId) : '',
    product_name: '',
    category_id: '',
    brand_id: '',
    unit_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isOptionsLoading = isCompaniesLoading || isCategoriesLoading || isBrandsLoading || isUnitsLoading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company_id) nextErrors.company_id = 'Company is required';
    if (!form.product_name.trim()) nextErrors.product_name = 'Product name is required';
    if (!form.category_id) nextErrors.category_id = 'Category is required';
    if (!form.brand_id) nextErrors.brand_id = 'Brand is required';
    if (!form.unit_id) nextErrors.unit_id = 'Unit is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = await createProduct({
        company_id: Number(form.company_id),
        product_name: form.product_name.trim(),
        category_id: Number(form.category_id),
        brand_id: Number(form.brand_id),
        unit_id: Number(form.unit_id),
      }).unwrap();
      toast.success(response.message || 'Product created successfully');
      navigate('/product');
    } catch (error: any) {
      const validationErrors = error?.data?.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        setErrors(
          Object.fromEntries(
            Object.entries(validationErrors).map(([key, value]) => [
              key,
              Array.isArray(value) ? String(value[0] ?? '') : String(value),
            ])
          )
        );
      }
      toast.error(error?.data?.message || 'Failed to create product');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Product</Typography>
      {!hasCompanyId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Select a company before creating a product.
        </Alert>
      )}
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
            required name="product_name" label="Product name" value={form.product_name}
            error={!!errors.product_name} helperText={errors.product_name}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, product_name: event.target.value }));
              setErrors((previous) => ({ ...previous, product_name: '' }));
            }}
          />
          <TextField
            select required name="category_id" label="Category" value={form.category_id}
            error={!!errors.category_id} helperText={errors.category_id} disabled={!hasCompanyId || isCategoriesLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, category_id: event.target.value }));
              setErrors((previous) => ({ ...previous, category_id: '' }));
            }}
          >
            {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
          </TextField>
          <TextField
            select required name="brand_id" label="Brand" value={form.brand_id}
            error={!!errors.brand_id} helperText={errors.brand_id} disabled={!hasCompanyId || isBrandsLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, brand_id: event.target.value }));
              setErrors((previous) => ({ ...previous, brand_id: '' }));
            }}
          >
            {brands.map((brand) => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
          </TextField>
          <TextField
            select required name="unit_id" label="Unit" value={form.unit_id}
            error={!!errors.unit_id} helperText={errors.unit_id} disabled={!hasCompanyId || isUnitsLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, unit_id: event.target.value }));
              setErrors((previous) => ({ ...previous, unit_id: '' }));
            }}
          >
            {units.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.unit_name} ({unit.short_name})</MenuItem>)}
          </TextField>
          <Button type="submit" variant="contained" disabled={isLoading || isOptionsLoading || !hasCompanyId}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
