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

export const brandSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandListResponse, GetBrandsParams>({
      query: ({ company_id, name, page = 1, per_page = 10 }) => ({
        url: 'brands',
        params: { company_id, ...(name ? { name } : {}), page, per_page },
      }),
      providesTags: ['brands'],
    }),
  }),
});

export const { useGetBrandsQuery } = brandSlice;