import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetProductsQuery } from '../../../../../redux/service/productSlice';
import {
  useGetSingleProductPriceQuery,
  useUpdateProductPriceMutation,
} from '../../../../../redux/service/productPriceSlice';

type ProductPriceForm = {
  product_id: string;
  purchase_price: string;
  sale_price: string;
  mrp: string;
  discount: string;
  tax: string;
  effective_from: string;
  effective_to: string;
};

export default function UpdateProductPrice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const priceId = Number(id);
  const companyId = getCurrentCompanyId();
  const validId = Number.isInteger(priceId) && priceId > 0;
  const { data: price, isLoading: isFetching, isError } = useGetSingleProductPriceQuery(
    { id: priceId, company_id: companyId },
    { skip: !validId || !companyId }
  );
  const { data: productResponse, isLoading: isProductsLoading } = useGetProductsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const products = productResponse?.data.data ?? [];
  const [updateProductPrice, { isLoading: isUpdating }] = useUpdateProductPriceMutation();
  const [form, setForm] = useState<ProductPriceForm>({
    product_id: '', purchase_price: '', sale_price: '', mrp: '', discount: '0', tax: '0',
    effective_from: '', effective_to: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!price) return;
    setForm({
      product_id: String(price.product_id),
      purchase_price: String(price.purchase_price),
      sale_price: String(price.sale_price),
      mrp: String(price.mrp),
      discount: String(price.discount),
      tax: String(price.tax),
      effective_from: price.effective_from?.slice(0, 10) ?? '',
      effective_to: price.effective_to?.slice(0, 10) ?? '',
    });
  }, [price]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.product_id) nextErrors.product_id = 'Product is required';
    for (const field of ['purchase_price', 'sale_price', 'mrp', 'discount', 'tax'] as const) {
      if (form[field] === '' || !Number.isFinite(Number(form[field])) || Number(form[field]) < 0) {
        nextErrors[field] = 'Enter a valid non-negative amount';
      }
    }
    if (!form.effective_from) nextErrors.effective_from = 'Effective from date is required';
    if (form.effective_to && form.effective_to < form.effective_from) {
      nextErrors.effective_to = 'End date must be on or after the start date';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = await updateProductPrice({
        id: priceId,
        data: {
          company_id: companyId,
          product_id: Number(form.product_id),
          purchase_price: Number(form.purchase_price),
          sale_price: Number(form.sale_price),
          mrp: Number(form.mrp),
          discount: Number(form.discount),
          tax: Number(form.tax),
          effective_from: form.effective_from,
          effective_to: form.effective_to || null,
        },
      }).unwrap();
      toast.success(response.message || 'Product price updated successfully');
      navigate('/product-price');
    } catch (error: any) {
      const validationErrors = error?.data?.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        setErrors(Object.fromEntries(Object.entries(validationErrors).map(([key, value]) => [key, Array.isArray(value) ? String(value[0] ?? '') : String(value)])));
      }
      toast.error(error?.data?.message || 'Failed to update product price');
    }
  };

  if (!validId) return <DashboardContent><Alert severity="error">Invalid product price ID.</Alert></DashboardContent>;
  if (!companyId) return <DashboardContent><Alert severity="error">A company ID is required.</Alert></DashboardContent>;
  if (isFetching || isProductsLoading) return <DashboardContent><Typography>Loading product price...</Typography></DashboardContent>;
  if (isError || !price) {
    return (
      <DashboardContent>
        <Alert severity="error">Unable to load this product price.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/product-price')}>Back to product prices</Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Update Product Price</Typography>
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField select required name="product_id" label="Product" value={form.product_id} error={!!errors.product_id} helperText={errors.product_id} disabled={isProductsLoading} onChange={(event) => setForm((previous) => ({ ...previous, product_id: event.target.value }))}>
            {products.map((product) => <MenuItem key={product.id} value={product.id}>{product.product_name}</MenuItem>)}
          </TextField>
          <TextField required type="number" name="purchase_price" label="Purchase price" value={form.purchase_price} error={!!errors.purchase_price} helperText={errors.purchase_price} inputProps={{ min: 0, step: 'any' }} onChange={(event) => setForm((previous) => ({ ...previous, purchase_price: event.target.value }))} />
          <TextField required type="number" name="sale_price" label="Sale price" value={form.sale_price} error={!!errors.sale_price} helperText={errors.sale_price} inputProps={{ min: 0, step: 'any' }} onChange={(event) => setForm((previous) => ({ ...previous, sale_price: event.target.value }))} />
          <TextField required type="number" name="mrp" label="MRP" value={form.mrp} error={!!errors.mrp} helperText={errors.mrp} inputProps={{ min: 0, step: 'any' }} onChange={(event) => setForm((previous) => ({ ...previous, mrp: event.target.value }))} />
          <TextField required type="number" name="discount" label="Discount" value={form.discount} error={!!errors.discount} helperText={errors.discount} inputProps={{ min: 0, step: 'any' }} onChange={(event) => setForm((previous) => ({ ...previous, discount: event.target.value }))} />
          <TextField required type="number" name="tax" label="Tax" value={form.tax} error={!!errors.tax} helperText={errors.tax} inputProps={{ min: 0, step: 'any' }} onChange={(event) => setForm((previous) => ({ ...previous, tax: event.target.value }))} />
          <TextField required type="date" name="effective_from" label="Effective from" value={form.effective_from} error={!!errors.effective_from} helperText={errors.effective_from} InputLabelProps={{ shrink: true }} onChange={(event) => setForm((previous) => ({ ...previous, effective_from: event.target.value }))} />
          <TextField type="date" name="effective_to" label="Effective to" value={form.effective_to} error={!!errors.effective_to} helperText={errors.effective_to} InputLabelProps={{ shrink: true }} onChange={(event) => setForm((previous) => ({ ...previous, effective_to: event.target.value }))} />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={isUpdating || isProductsLoading}>
              {isUpdating ? 'Updating...' : 'Update Price'}
            </Button>
            <Button type="button" onClick={() => navigate('/product-price')}>Cancel</Button>
          </Stack>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
