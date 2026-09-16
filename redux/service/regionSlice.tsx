
import { api } from '../api/baseApi';

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export interface RegionCountry {
  id: number;
  name: string;
  code: string | null;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface Region {
  id: number;
  country_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  country?: RegionCountry;
}

export interface RegionResponse {
  status: number;
  data: Region[];
}

// ----------------------------------------------------------------------
// API
// ----------------------------------------------------------------------

export const regionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------------------------
    // GET ALL REGIONS
    // ------------------------------------------------------------
    getRegions: builder.query<RegionResponse, void>({
      query: () => ({
        url: 'regions',
        method: 'GET',
      }),

      transformResponse: (response: any): RegionResponse => ({
        status: response.status,
        data: response.data ?? [],
      }),

      providesTags: ['regions'],
    }),

    // ------------------------------------------------------------
    // GET SINGLE REGION
    // ------------------------------------------------------------
    getSingleRegion: builder.query<Region, number>({
      query: (id) => `regions/${id}`,

      transformResponse: (response: any): Region => {
        return response.data ?? response;
      },

      providesTags: ['regions'],
    }),

    // ------------------------------------------------------------
    // CREATE REGION
    // ------------------------------------------------------------
    createRegion: builder.mutation<
      Region,
      {
        country_id: number;
        name: string;
        status: number;
      }
    >({
      query: (body) => ({
        url: 'regions',
        method: 'POST',
        body,
      }),

      transformResponse: (response: any): Region => {
        return response.data ?? response;
      },

      invalidatesTags: ['regions'],
    }),

    // ------------------------------------------------------------
    // UPDATE REGION
    // ------------------------------------------------------------
    updateRegion: builder.mutation<
      Region,
      {
        id: number;
        data: {
          country_id: number;
          name: string;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `regions/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: any): Region => {
        return response.data ?? response;
      },

      invalidatesTags: ['regions'],
    }),

    // ------------------------------------------------------------
    // DELETE REGION
    // ------------------------------------------------------------
    deleteRegion: builder.mutation<void, number>({
      query: (id) => ({
        url: `regions/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['regions'],
    }),
  }),
});

// ----------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------

export const {
  useGetRegionsQuery,
  useGetSingleRegionQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} = regionSlice;
