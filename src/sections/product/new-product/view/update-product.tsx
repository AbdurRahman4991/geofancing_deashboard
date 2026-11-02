import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCategoriesQuery } from '../../../../../redux/service/categorySlice';
import { useGetBrandsQuery } from '../../../../../redux/service/brandSlice';
import { useGetUnitsQuery } from '../../../../../redux/service/unitSlice';
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from '../../../../../redux/service/productSlice';

type ProductForm = {
  product_name: string;
  category_id: string;
  brand_id: string;
  unit_id: string;
};

export default function UpdateProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);
  const companyId = getCurrentCompanyId();
  const validId = Number.isInteger(productId) && productId > 0;
  const {
    data: product,
    isLoading: isFetching,
    isError,
  } = useGetSingleProductQuery(
    { id: productId, company_id: companyId },
    { skip: !validId || !companyId }
  );
  const { data: categoryResponse, isLoading: isCategoriesLoading } = useGetCategoriesQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const { data: brandResponse, isLoading: isBrandsLoading } = useGetBrandsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const { data: unitResponse, isLoading: isUnitsLoading } = useGetUnitsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const categories = categoryResponse?.data.data ?? [];
  const brands = brandResponse?.data.data ?? [];
  const units = unitResponse?.data.data ?? [];
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [form, setForm] = useState<ProductForm>({
    product_name: '',
    category_id: '',
    brand_id: '',
    unit_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) return;
    setForm({
      product_name: product.product_name ?? '',
      category_id: String(product.category_id ?? ''),
      brand_id: String(product.brand_id ?? ''),
      unit_id: String(product.unit_id ?? ''),
    });
  }, [product]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.product_name.trim()) nextErrors.product_name = 'Product name is required';
    if (!form.category_id) nextErrors.category_id = 'Category is required';
    if (!form.brand_id) nextErrors.brand_id = 'Brand is required';
    if (!form.unit_id) nextErrors.unit_id = 'Unit is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = await updateProduct({
        id: productId,
        data: {
          company_id: companyId,
          product_name: form.product_name.trim(),
          category_id: Number(form.category_id),
          brand_id: Number(form.brand_id),
          unit_id: Number(form.unit_id),
        },
      }).unwrap();
      toast.success(response.message || 'Product updated successfully');
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
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  if (!validId) return <DashboardContent><Alert severity="error">Invalid product ID.</Alert></DashboardContent>;
  if (!companyId) return <DashboardContent><Alert severity="error">A company ID is required.</Alert></DashboardContent>;
  if (isFetching || isCategoriesLoading || isBrandsLoading || isUnitsLoading) {
    return <DashboardContent><Typography>Loading product...</Typography></DashboardContent>;
  }
  if (isError || !product) {
    return (
      <DashboardContent>
        <Alert severity="error">Unable to load this product.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/product')}>Back to products</Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Product</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
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
            error={!!errors.category_id} helperText={errors.category_id} disabled={isCategoriesLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, category_id: event.target.value }));
              setErrors((previous) => ({ ...previous, category_id: '' }));
            }}
          >
            {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
          </TextField>
          <TextField
            select required name="brand_id" label="Brand" value={form.brand_id}
            error={!!errors.brand_id} helperText={errors.brand_id} disabled={isBrandsLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, brand_id: event.target.value }));
              setErrors((previous) => ({ ...previous, brand_id: '' }));
            }}
          >
            {brands.map((brand) => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
          </TextField>
          <TextField
            select required name="unit_id" label="Unit" value={form.unit_id}
            error={!!errors.unit_id} helperText={errors.unit_id} disabled={isUnitsLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, unit_id: event.target.value }));
              setErrors((previous) => ({ ...previous, unit_id: '' }));
            }}
          >
            {units.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.unit_name} ({unit.short_name})</MenuItem>)}
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Product'}
            </Button>
            <Button type="button" onClick={() => navigate('/product')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
