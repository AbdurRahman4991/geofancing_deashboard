import { api } from '../api/baseApi';

export interface CountryHiearchyLevel {
  id: number;
  company_id: number;
  name: string;
  code: string | null;
  level_order: number;
  is_active: boolean;
  nodes_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CountryHiearchyLevelPage {
  current_page: number;
  data: CountryHiearchyLevel[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CountryHiearchyLevelListParams {
  company_id: number;
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}

export interface CountryHiearchyLevelData {
  name: string;
  code?: string | null;
  level_order: number;
  is_active?: boolean;
}

type LaravelPageResponse = CountryHiearchyLevelPage | { data: CountryHiearchyLevelPage };
type LaravelItemResponse = CountryHiearchyLevel | { data: CountryHiearchyLevel };

function unwrapPage(response: LaravelPageResponse): CountryHiearchyLevelPage {
  if ('current_page' in response) return response;
  return response.data;
}

function unwrapItem(response: LaravelItemResponse): CountryHiearchyLevel {
  if ('id' in response) return response;
  return response.data;
}

export const countryHiearchyLevelService = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountryHiearchyLevels: builder.query<CountryHiearchyLevelPage, CountryHiearchyLevelListParams>({
      query: ({ company_id, page = 1, per_page = 15, search, is_active }) => ({
        url: 'country-hierarchy-levels',
        params: { company_id, page, per_page, search, ...(is_active === undefined ? {} : { is_active }) },
      }),
      transformResponse: unwrapPage,
      providesTags: ['countryHierarchyLevels'],
    }),
    getCountryHiearchyLevel: builder.query<CountryHiearchyLevel, { company_id: number; id: number }>({
      query: ({ company_id, id }) => ({ url: `country-hierarchy-levels/${id}`, params: { company_id } }),
      transformResponse: unwrapItem,
      providesTags: ['countryHierarchyLevels'],
    }),
    createCountryHiearchyLevel: builder.mutation<CountryHiearchyLevel, { company_id: number; data: CountryHiearchyLevelData }>({
      query: ({ company_id, data }) => ({ url: 'country-hierarchy-levels', method: 'POST', params: { company_id }, body: data }),
      transformResponse: unwrapItem,
      invalidatesTags: ['countryHierarchyLevels'],
    }),
    updateCountryHiearchyLevel: builder.mutation<CountryHiearchyLevel, { company_id: number; id: number; data: Partial<CountryHiearchyLevelData> }>({
      query: ({ company_id, id, data }) => ({ url: `country-hierarchy-levels/${id}`, method: 'PUT', params: { company_id }, body: data }),
      transformResponse: unwrapItem,
      invalidatesTags: ['countryHierarchyLevels'],
    }),
    deleteCountryHiearchyLevel: builder.mutation<void, { company_id: number; id: number }>({
      query: ({ company_id, id }) => ({ url: `country-hierarchy-levels/${id}`, method: 'DELETE', params: { company_id } }),
      invalidatesTags: ['countryHierarchyLevels'],
    }),
  }),
});

export const {
  useGetCountryHiearchyLevelsQuery,
  useGetCountryHiearchyLevelQuery,
  useCreateCountryHiearchyLevelMutation,
  useUpdateCountryHiearchyLevelMutation,
  useDeleteCountryHiearchyLevelMutation,
} = countryHiearchyLevelService;
