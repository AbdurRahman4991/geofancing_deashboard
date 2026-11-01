import { api } from '../api/baseApi';

export interface Brand {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BrandPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface BrandPage {
  current_page: number;
  data: Brand[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: BrandPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface BrandListResponse {
  message: string;
  data: BrandPage;
}

export interface GetBrandsParams {
  company_id: number | string;
  name?: string;
  page?: number;
  per_page?: number;
}

export interface BrandRequest {
  company_id: number;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
}

export interface SingleBrandParams {
  id: number;
  company_id: number;
}

function unwrapBrand(response: { data?: Brand } | Brand): Brand {
  return 'data' in response && response.data ? response.data : (response as Brand);
}

export const brandSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandListResponse, GetBrandsParams>({
      query: ({ company_id, name, page = 1, per_page = 10 }) => ({
        url: 'brands',
        params: { company_id, ...(name ? { name } : {}), page, per_page },
      }),
      providesTags: ['brands'],
    }),
    getSingleBrand: builder.query<Brand, SingleBrandParams>({
      query: ({ id, company_id }) => ({
        url: `brands/${id}`,
        params: { company_id },
      }),
      transformResponse: unwrapBrand,
      providesTags: (_result, _error, { id }) => [{ type: 'brands', id }],
    }),
    createBrand: builder.mutation<Brand, BrandRequest>({
      query: (body) => ({
        url: 'brands',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      transformResponse: unwrapBrand,
      invalidatesTags: ['brands'],
    }),
    updateBrand: builder.mutation<Brand, { id: number; data: BrandRequest }>({
      query: ({ id, data }) => ({
        url: `brands/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      transformResponse: unwrapBrand,
      invalidatesTags: (_result, _error, { id }) => ['brands', { type: 'brands', id }],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} = brandSlice;