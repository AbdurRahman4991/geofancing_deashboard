import { api } from '../api/baseApi';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface Level {
  id: number;
  company_id: number;
  name: string;
  code: string | null;
  level_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  nodes_count?: number;
}

export interface LevelPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface LevelResponse {
  status: number;
  data: LevelPagination & {
    data: Level[];
  };
}

export interface LevelQueryParams {
  company_id: number;
  page?: number;
  per_page?: number;
}

export interface LevelRequest {
  company_id: number;
  name: string;
  code?: string | null;
  level_order: number;
  is_active: boolean;
}

export interface SingleLevelQueryParams {
  id: number;
  company_id: number;
}

// ----------------------------------------------------------------------
// API
// ----------------------------------------------------------------------

export const levelSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<LevelResponse, LevelQueryParams>({
      query: ({ company_id, page, per_page }) => ({
        url: 'hierarchy-levels',
        method: 'GET',
        params: { company_id, page, per_page },
      }),
    }),

    getSingleLevel: builder.query<Level, SingleLevelQueryParams>({
      query: ({ id, company_id }) => ({
        url: `hierarchy-levels/${id}`,
        method: 'GET',
        params: { company_id },
      }),
      transformResponse: (response: any): Level => response.data ?? response,
    }),

    createLevel: builder.mutation<Level, LevelRequest>({
      query: (body) => ({
        url: 'hierarchy-levels',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): Level => response.data ?? response,
    }),

    updateLevel: builder.mutation<
      Level,
      { id: number; data: Partial<LevelRequest> }
    >({
      query: ({ id, data }) => ({
        url: `hierarchy-levels/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any): Level => response.data ?? response,
    }),

    deleteLevel: builder.mutation<void, number>({
      query: (id) => ({
        url: `hierarchy-levels/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export const {
  useGetLevelsQuery,
  useGetSingleLevelQuery,
  useCreateLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} = levelSlice;
