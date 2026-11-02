import { api } from '../api/baseApi';

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBrand {
  id: number;
  name: string;
}

export interface ProductUnit {
  id: number;
  unit_name: string;
  short_name: string;
}

export interface ProductSubCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  product_name: string;
  category_id: number | string;
  brand_id: number | string;
  unit_id: number | string;
  company_id: number;
  created_at: string;
  updated_at: string;
  category: ProductCategory | null;
  sub_category: ProductSubCategory | null;
  brand: ProductBrand | null;
  unit: ProductUnit | null;
}

export interface ProductPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ProductPage {
  current_page: number;
  data: Product[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: ProductPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ProductListResponse {
  message: string;
  data: ProductPage;
}

export interface GetProductsParams {
  company_id: number | string;
  product_name?: string;
  page?: number;
  per_page?: number;
}

export interface SingleProductParams {
  id: number;
  company_id: number | string;
}

export interface CreateProductRequest {
  product_name: string;
  category_id: number;
  brand_id: number;
  unit_id: number;
  company_id: number;
}

export interface ProductMutationResponse {
  message: string;
  data: Product;
}

function unwrapProduct(response: { data?: Product } | Product): Product {
  return 'data' in response && response.data ? response.data : (response as Product);
}

export const productSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, GetProductsParams>({
      query: ({ company_id, product_name, page = 1, per_page = 10 }) => ({
        url: 'products',
        params: {
          company_id,
          ...(product_name ? { product_name } : {}),
          page,
          per_page,
        },
      }),
      providesTags: ['products'],
    }),
    getSingleProduct: builder.query<Product, SingleProductParams>({
      query: ({ id, company_id }) => ({ url: `products/${id}`, params: { company_id } }),
      transformResponse: unwrapProduct,
      providesTags: (_result, _error, { id }) => [{ type: 'products', id }],
    }),
    createProduct: builder.mutation<ProductMutationResponse, CreateProductRequest>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      invalidatesTags: ['products'],
    }),
    updateProduct: builder.mutation<ProductMutationResponse, { id: number; data: CreateProductRequest }>({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['products', { type: 'products', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productSlice;
