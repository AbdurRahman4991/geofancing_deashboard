import { api } from '../api/baseApi';

export interface ProductStockUnit {
  id: number;
  unit_name: string;
  short_name: string;
}

export interface ProductStockProduct {
  id: number;
  company_id: number;
  product_name: string;
  unit_id: number;
  unit: ProductStockUnit | null;
}

export interface ProductStock {
  id: number;
  company_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: string | number;
  reserved_quantity: string | number;
  reorder_level: string | number;
  created_at: string;
  updated_at: string;
  product: ProductStockProduct | null;
}

export interface ProductStockPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ProductStockPage {
  current_page: number;
  data: ProductStock[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: ProductStockPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ProductStockListResponse {
  message: string;
  data: ProductStockPage;
}

export interface GetProductStocksParams {
  company_id: number | string;
  product_id?: number | string;
  quantity?: number | string;
  warehouse_id?: number | string;
  page?: number;
  per_page?: number;
}

export interface ProductStockRequest {
  company_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  reorder_level: number;
}

export interface ProductStockMutationResponse {
  message: string;
  data: ProductStock;
}

export interface SingleProductStockParams {
  id: number;
  company_id: number | string;
}

function unwrapProductStock(response: { data?: ProductStock } | ProductStock): ProductStock {
  return 'data' in response && response.data ? response.data : (response as ProductStock);
}

export const productStockSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductStocks: builder.query<ProductStockListResponse, GetProductStocksParams>({
      query: ({ company_id, product_id, quantity, warehouse_id, page = 1, per_page = 10 }) => ({
        url: 'product-stocks',
        params: {
          company_id,
          ...(product_id !== undefined && product_id !== '' ? { product_id } : {}),
          ...(quantity !== undefined && quantity !== '' ? { quantity } : {}),
          ...(warehouse_id !== undefined && warehouse_id !== '' ? { warehouse_id } : {}),
          page,
          per_page,
        },
      }),
      providesTags: ['productStocks'],
    }),
    getSingleProductStock: builder.query<ProductStock, SingleProductStockParams>({
      query: ({ id, company_id }) => ({ url: `product-stocks/${id}`, params: { company_id } }),
      transformResponse: unwrapProductStock,
      providesTags: (_result, _error, { id }) => [{ type: 'productStocks', id }],
    }),
    createProductStock: builder.mutation<ProductStockMutationResponse, ProductStockRequest>({
      query: (body) => ({
        url: 'product-stocks',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      invalidatesTags: ['productStocks'],
    }),
    updateProductStock: builder.mutation<
      ProductStockMutationResponse,
      { id: number; data: ProductStockRequest }
    >({
      query: ({ id, data }) => ({
        url: `product-stocks/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['productStocks', { type: 'productStocks', id }],
    }),
  }),
});

export const {
  useGetProductStocksQuery,
  useGetSingleProductStockQuery,
  useCreateProductStockMutation,
  useUpdateProductStockMutation,
} = productStockSlice;
