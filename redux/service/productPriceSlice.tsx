import { api } from '../api/baseApi';

export interface ProductPriceProduct {
  id: number;
  company_id: number;
  product_name: string;
}

export interface ProductPrice {
  id: number;
  company_id: number;
  product_id: number;
  purchase_price: string | number;
  sale_price: string | number;
  mrp: string | number;
  discount: string | number;
  tax: string | number;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  product: ProductPriceProduct | null;
}

export interface ProductPricePaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ProductPricePage {
  current_page: number;
  data: ProductPrice[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: ProductPricePaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ProductPriceListResponse {
  message: string;
  data: ProductPricePage;
}

export interface GetProductPricesParams {
  company_id: number | string;
  product_id?: number | string;
  page?: number;
  per_page?: number;
}

export interface ProductPriceRequest {
  company_id: number;
  product_id: number;
  purchase_price: number;
  sale_price: number;
  mrp: number;
  discount: number;
  tax: number;
  effective_from: string;
  effective_to: string | null;
}

export interface ProductPriceMutationResponse {
  message: string;
  data: ProductPrice;
}

export interface SingleProductPriceParams {
  id: number;
  company_id: number | string;
}

function unwrapProductPrice(response: { data?: ProductPrice } | ProductPrice): ProductPrice {
  return 'data' in response && response.data ? response.data : (response as ProductPrice);
}

export const productPriceSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductPrices: builder.query<ProductPriceListResponse, GetProductPricesParams>({
      query: ({ company_id, product_id, page = 1, per_page = 10 }) => ({
        url: 'product-prices',
        params: {
          company_id,
          ...(product_id !== undefined && product_id !== '' ? { product_id } : {}),
          page,
          per_page,
        },
      }),
      providesTags: ['productPrices'],
    }),
    getSingleProductPrice: builder.query<ProductPrice, SingleProductPriceParams>({
      query: ({ id, company_id }) => ({ url: `product-prices/${id}`, params: { company_id } }),
      transformResponse: unwrapProductPrice,
      providesTags: (_result, _error, { id }) => [{ type: 'productPrices', id }],
    }),
    createProductPrice: builder.mutation<ProductPriceMutationResponse, ProductPriceRequest>({
      query: (body) => ({
        url: 'product-prices',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      invalidatesTags: ['productPrices'],
    }),
    updateProductPrice: builder.mutation<
      ProductPriceMutationResponse,
      { id: number; data: ProductPriceRequest }
    >({
      query: ({ id, data }) => ({
        url: `product-prices/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['productPrices', { type: 'productPrices', id }],
    }),
  }),
});

export const {
  useGetProductPricesQuery,
  useGetSingleProductPriceQuery,
  useCreateProductPriceMutation,
  useUpdateProductPriceMutation,
} = productPriceSlice;
