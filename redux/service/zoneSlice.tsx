import { api } from '../api/baseApi';

// ----------------------------------------------------------------------
// Region Interface
// ----------------------------------------------------------------------

export interface ZoneRegion {
  id: number;
  country_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------
// Zone Interface
// ----------------------------------------------------------------------

export interface Zone {
  id: number;
  region_id: number;
  name: string;
  code?: string;
  status: number;
  created_at?: string;
  updated_at?: string;

  region?: ZoneRegion | null;
}

// ----------------------------------------------------------------------
// Pagination Interface
// ----------------------------------------------------------------------

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

// ----------------------------------------------------------------------
// API Response
// ----------------------------------------------------------------------

export interface ZoneResponse {
  status: number;

  data: PaginationData & {
    data: Zone[];
  };
}

// ----------------------------------------------------------------------
// Query Parameters
// ----------------------------------------------------------------------

export interface ZoneQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  region_id?: number;
}

// ----------------------------------------------------------------------
// Zone Request
// ----------------------------------------------------------------------

export interface ZoneRequest {
  region_id: number;
  name: string;
  code?: string;
  status: number;
}

// ----------------------------------------------------------------------
// Zone Slice
// ----------------------------------------------------------------------

export const zoneSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ------------------------------------------------------------
    // Get Zones
    // ------------------------------------------------------------

    getZones: builder.query<
      ZoneResponse,
      ZoneQueryParams | void
    >({
      query: (params) => ({
        url: 'zones',
        method: 'GET',

        params: {
          page: params?.page,
          per_page: params?.per_page,
          search: params?.search,
          region_id: params?.region_id,
        },
      }),

      transformResponse: (response: any): ZoneResponse => ({
        status: response.status,
        data: response.data,
      }),

      providesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Get Single Zone
    // ------------------------------------------------------------

    getSingleZone: builder.query<Zone, number>({
      query: (id) => ({
        url: `zones/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: any): Zone => {
        return response.data ?? response;
      },

      providesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Create Zone
    // ------------------------------------------------------------

    createZone: builder.mutation<Zone, ZoneRequest>({
      query: (body) => ({
        url: 'zones',
        method: 'POST',
        body,
      }),

      transformResponse: (response: any): Zone => {
        return response.data ?? response;
      },

      invalidatesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Update Zone
    // ------------------------------------------------------------

    updateZone: builder.mutation<
      Zone,
      {
        id: number;
        data: ZoneRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `zones/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: any): Zone => {
        return response.data ?? response;
      },

      invalidatesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Delete Zone
    // ------------------------------------------------------------

    deleteZone: builder.mutation<void, number>({
      query: (id) => ({
        url: `zones/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['zones'],
    }),
  }),
});

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export const {
  useGetZonesQuery,
  useGetSingleZoneQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = zoneSlice;