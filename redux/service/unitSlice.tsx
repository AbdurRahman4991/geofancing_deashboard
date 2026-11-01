import { api } from '../api/baseApi';

export interface Unit {
  id: number;
  company_id: number;
  unit_name: string;
  short_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UnitPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface UnitPage {
  current_page: number;
  data: Unit[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: UnitPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface UnitListResponse {
  message: string;
  data: UnitPage;
}

export interface GetUnitsParams {
  company_id: number | string;
  unit_name?: string;
  short_name?: string;
  page?: number;
  per_page?: number;
}

export interface UnitRequest {
  company_id: number;
  unit_name: string;
  short_name: string;
  status: 'active' | 'inactive';
}

export interface SingleUnitParams {
  id: number;
  company_id: number;
}

function unwrapUnit(response: { data?: Unit } | Unit): Unit {
  return 'data' in response && response.data ? response.data : (response as Unit);
}

export const unitSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<UnitListResponse, GetUnitsParams>({
      query: ({ company_id, unit_name, short_name, page = 1, per_page = 10 }) => ({
        url: 'units',
        params: {
          company_id,
          ...(unit_name ? { unit_name } : {}),
          ...(short_name ? { short_name } : {}),
          page,
          per_page,
        },
      }),
      providesTags: ['units'],
    }),
    getSingleUnit: builder.query<Unit, SingleUnitParams>({
      query: ({ id, company_id }) => ({ url: `units/${id}`, params: { company_id } }),
      transformResponse: unwrapUnit,
      providesTags: (_result, _error, { id }) => [{ type: 'units', id }],
    }),
    createUnit: builder.mutation<Unit, UnitRequest>({
      query: (body) => ({
        url: 'units',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      transformResponse: unwrapUnit,
      invalidatesTags: ['units'],
    }),
    updateUnit: builder.mutation<Unit, { id: number; data: UnitRequest }>({
      query: ({ id, data }) => ({
        url: `units/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      transformResponse: unwrapUnit,
      invalidatesTags: (_result, _error, { id }) => ['units', { type: 'units', id }],
    }),
  }),
});

export const { useGetUnitsQuery, useGetSingleUnitQuery, useCreateUnitMutation, useUpdateUnitMutation } = unitSlice;