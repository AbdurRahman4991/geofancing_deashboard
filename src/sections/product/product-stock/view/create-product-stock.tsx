import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Card, Stack, TextField, Button, Typography, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetProductsQuery } from '../../../../../redux/service/productSlice';
import { useCreateProductStockMutation } from '../../../../../redux/service/productStockSlice';

export default function CreateProductStockView() {
  const navigate = useNavigate();
  const companyId = getCurrentCompanyId();
  const hasCompanyId = Number.isInteger(companyId) && companyId > 0;
  const { data: productResponse, isLoading: isProductsLoading } = useGetProductsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !hasCompanyId }
  );
  const products = productResponse?.data.data ?? [];
  const [createProductStock, { isLoading }] = useCreateProductStockMutation();
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', reorder_level: '0' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.product_id) nextErrors.product_id = 'Product is required';
    if (!form.warehouse_id || Number(form.warehouse_id) <= 0) nextErrors.warehouse_id = 'Valid warehouse ID is required';
    if (!form.quantity || Number(form.quantity) < 0) nextErrors.quantity = 'Quantity must be zero or greater';
    if (form.reorder_level === '' || Number(form.reorder_level) < 0) nextErrors.reorder_level = 'Reorder level must be zero or greater';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = await createProductStock({
        company_id: companyId,
        product_id: Number(form.product_id),
        warehouse_id: Number(form.warehouse_id),
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level),
      }).unwrap();
      toast.success(response.message || 'Product stock created successfully');
      navigate('/product-stock');
    } catch (error: any) {
      const validationErrors = error?.data?.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        setErrors(Object.fromEntries(Object.entries(validationErrors).map(([key, value]) => [key, Array.isArray(value) ? String(value[0] ?? '') : String(value)])));
      }
      toast.error(error?.data?.message || 'Failed to create product stock');
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>Create Product Stock</Typography>
      {!hasCompanyId && <Alert severity="warning" sx={{ mb: 2 }}>A company ID is required.</Alert>}
      <Card sx={{ p: 3, maxWidth: 600 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField
            select required name="product_id" label="Product" value={form.product_id}
            error={!!errors.product_id} helperText={errors.product_id} disabled={!hasCompanyId || isProductsLoading}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, product_id: event.target.value }));
              setErrors((previous) => ({ ...previous, product_id: '' }));
            }}
          >
            {products.map((product) => <MenuItem key={product.id} value={product.id}>{product.product_name}</MenuItem>)}
          </TextField>
          <TextField
            required type="number" name="warehouse_id" label="Warehouse ID" value={form.warehouse_id}
            error={!!errors.warehouse_id} helperText={errors.warehouse_id} inputProps={{ min: 1, step: 1 }}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, warehouse_id: event.target.value }));
              setErrors((previous) => ({ ...previous, warehouse_id: '' }));
            }}
          />
          <TextField
            required type="number" name="quantity" label="Quantity" value={form.quantity}
            error={!!errors.quantity} helperText={errors.quantity} inputProps={{ min: 0, step: 'any' }}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, quantity: event.target.value }));
              setErrors((previous) => ({ ...previous, quantity: '' }));
            }}
          />
          <TextField
            required type="number" name="reorder_level" label="Reorder level" value={form.reorder_level}
            error={!!errors.reorder_level} helperText={errors.reorder_level} inputProps={{ min: 0, step: 'any' }}
            onChange={(event) => {
              setForm((previous) => ({ ...previous, reorder_level: event.target.value }));
              setErrors((previous) => ({ ...previous, reorder_level: '' }));
            }}
          />
          <Button type="submit" variant="contained" disabled={isLoading || isProductsLoading || !hasCompanyId}>
            {isLoading ? 'Creating...' : 'Create Stock'}
          </Button>
        </Stack>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </DashboardContent>
  );
}
