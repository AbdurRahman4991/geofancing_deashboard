import { useState } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentCompanyId } from 'src/utils/auth';
import { useGetCategoriesQuery } from '../../../redux/service/categorySlice';
import { useGetSubCategoriesQuery } from '../../../redux/service/subCategorySlice';
import { useGetBrandsQuery } from '../../../redux/service/brandSlice';
import { useGetProductsQuery } from '../../../redux/service/productSlice';
import {
  useExportOrderReportMutation,
  useGetOrderReportQuery,
} from '../../../redux/service/orderReportService';
import type { MarketVisitReportPeriod } from '../../../redux/service/marketVisitReportService';
import { ReportExportButtons } from './report-export-buttons';
import { ReportFilters } from './report-filters';

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getPeriodRange = (anchorDate: string, period: MarketVisitReportPeriod) => {
  const anchor = new Date(`${anchorDate}T00:00:00`);
  if (period === 'daily') return { from_date: anchorDate, to_date: anchorDate };
  if (period === 'weekly') {
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from_date: formatDate(start), to_date: formatDate(end) };
  }
  if (period === 'monthly') {
    return {
      from_date: formatDate(new Date(anchor.getFullYear(), anchor.getMonth(), 1)),
      to_date: formatDate(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)),
    };
  }
  return {
    from_date: formatDate(new Date(anchor.getFullYear(), 0, 1)),
    to_date: formatDate(new Date(anchor.getFullYear(), 11, 31)),
  };
};

const formatAmount = (value: string | number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const statusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Card>
  );
}

export default function DailyOrderSummary() {
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [period, setPeriod] = useState<MarketVisitReportPeriod>('daily');
  const [hierarchyLevelId, setHierarchyLevelId] = useState('');
  const [hierarchyNodeId, setHierarchyNodeId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [productId, setProductId] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 15;
  const companyId = getCurrentCompanyId();
  const { data: categoriesResponse } = useGetCategoriesQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const { data: subCategoriesResponse } = useGetSubCategoriesQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const { data: brandsResponse } = useGetBrandsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const { data: productsResponse } = useGetProductsQuery(
    { company_id: companyId, page: 1, per_page: 100 },
    { skip: !companyId }
  );
  const categories = categoriesResponse?.data.data ?? [];
  const subCategories = (subCategoriesResponse?.data.data ?? []).filter(
    (subCategory) => !categoryId || String(subCategory.category_id) === categoryId
  );
  const brands = brandsResponse?.data.data ?? [];
  const products = (productsResponse?.data.data ?? []).filter(
    (product) =>
      (!categoryId || String(product.category_id) === categoryId) &&
      (!subCategoryId || String(product.sub_category?.id ?? '') === subCategoryId) &&
      (!brandId || String(product.brand_id) === brandId)
  );
  const [exportOrderReport, { isLoading: isExporting }] = useExportOrderReportMutation();
  const dateRange = getPeriodRange(selectedDate, period);
  const reportFilters = {
    ...dateRange,
    ...(categoryId ? { category_id: Number(categoryId) } : {}),
    ...(subCategoryId ? { sub_category_id: Number(subCategoryId) } : {}),
    ...(brandId ? { brand_id: Number(brandId) } : {}),
    ...(productId ? { product_id: Number(productId) } : {}),
    ...(hierarchyLevelId ? { hierarchy_level_id: Number(hierarchyLevelId) } : {}),
    ...(hierarchyNodeId ? { hierarchy_node_id: Number(hierarchyNodeId) } : {}),
    ...(userId ? { user_id: Number(userId) } : {}),
    ...(status ? { status } : {}),
  };
  const { data, isLoading, isFetching, isError } = useGetOrderReportQuery({
    ...reportFilters,
    page: page + 1,
    per_page: perPage,
  });
  const rows = data?.data ?? [];
  const summary = data?.summary;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const file = await exportOrderReport({ ...reportFilters, export: format }).unwrap();
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `order-report-${dateRange.from_date}-to-${dateRange.to_date}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Could not export the order report.', error);
    }
  };

  return (
    <DashboardContent>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Order Summary
          </Typography>
          <ReportExportButtons
            disabled={isExporting}
            onExcel={() => handleExport('excel')}
            onPdf={() => handleExport('pdf')}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          <ReportFilters
            date={selectedDate}
            period={period}
            hierarchyLevelId={hierarchyLevelId}
            hierarchyNodeId={hierarchyNodeId}
            userId={userId}
            visitStatus="all"
            onDateChange={(value) => {
              setSelectedDate(value);
              setPage(0);
            }}
            onPeriodChange={(value) => {
              setPeriod(value);
              setPage(0);
            }}
            onHierarchyLevelChange={setHierarchyLevelId}
            onHierarchyNodeChange={setHierarchyNodeId}
            onUserChange={setUserId}
            onVisitStatusChange={() => undefined}
            onFilterChange={() => setPage(0)}
            dateLabel="Period date"
            showPeriod
            showVisitStatus={false}
            idPrefix="order-report"
          />
          <FormControl size="small" sx={{ minWidth: 170 }} disabled={!companyId}>
            <InputLabel id="order-category-label">Category</InputLabel>
            <Select
              labelId="order-category-label"
              value={categoryId}
              label="Category"
              onChange={(event) => {
                setCategoryId(event.target.value);
                setSubCategoryId('');
                setProductId('');
                setPage(0);
              }}
            >
              <MenuItem value="">All categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }} disabled={!categoryId}>
            <InputLabel id="order-subcategory-label">Subcategory</InputLabel>
            <Select
              labelId="order-subcategory-label"
              value={subCategoryId}
              label="Subcategory"
              onChange={(event) => {
                setSubCategoryId(event.target.value);
                setProductId('');
                setPage(0);
              }}
            >
              <MenuItem value="">All subcategories</MenuItem>
              {subCategories.map((subCategory) => (
                <MenuItem key={subCategory.id} value={String(subCategory.id)}>
                  {subCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }} disabled={!companyId}>
            <InputLabel id="order-brand-label">Brand</InputLabel>
            <Select
              labelId="order-brand-label"
              value={brandId}
              label="Brand"
              onChange={(event) => {
                setBrandId(event.target.value);
                setProductId('');
                setPage(0);
              }}
            >
              <MenuItem value="">All brands</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 190 }} disabled={!companyId}>
            <InputLabel id="order-product-label">Product</InputLabel>
            <Select
              labelId="order-product-label"
              value={productId}
              label="Product"
              onChange={(event) => {
                setProductId(event.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All products</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={String(product.id)}>
                  {product.product_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="order-status-label">Order status</InputLabel>
            <Select
              labelId="order-status-label"
              value={status}
              label="Order status"
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {isError ? (
        <Typography color="error">Could not load the order report.</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total orders"
                value={isLoading ? '—' : (summary?.total_orders ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total quantity"
                value={isLoading ? '—' : (summary?.total_quantity ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total amount"
                value={isLoading ? '—' : formatAmount(summary?.total_amount ?? 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Employees"
                value={isLoading ? '—' : (summary?.total_employees ?? 0)}
              />
            </Grid>
          </Grid>

          <Card>
            <TableContainer>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Market</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Order date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.employee?.name ?? '—'}</TableCell>
                      <TableCell>{order.geofence?.firm_name ?? '—'}</TableCell>
                      <TableCell>
                        <Chip size="small" label={order.status} color={statusColor(order.status)} />
                      </TableCell>
                      <TableCell>
                        {order.items
                          .map((item) => item.product?.product_name ?? 'Product')
                          .join(', ') || '—'}
                      </TableCell>
                      <TableCell align="right">
                        {order.items.reduce((total, item) => total + Number(item.quantity || 0), 0)}
                      </TableCell>
                      <TableCell align="right">{formatAmount(order.total)}</TableCell>
                      <TableCell>{formatDateTime(order.order_date)}</TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No orders found for this filter.
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Loading order report...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.pagination.total ?? 0}
              page={page}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
              rowsPerPage={perPage}
              rowsPerPageOptions={[perPage]}
            />
            {isFetching && !isLoading && (
              <Typography sx={{ px: 2, pb: 1 }} variant="caption" color="text.secondary">
                Updating report…
              </Typography>
            )}
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
