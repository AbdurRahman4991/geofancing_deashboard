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
  status: number;
  created_at?: string;
  updated_at?: string;

  region?: ZoneRegion;
}

// ----------------------------------------------------------------------
// API Response
// ----------------------------------------------------------------------

export interface ZoneResponse {
  status: number;
  data: Zone[];
}

// ----------------------------------------------------------------------
// Zone Slice
// ----------------------------------------------------------------------

export const zoneSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------------------------
    // Get All Zones
    // ------------------------------------------------------------

    getZones: builder.query<ZoneResponse, void>({
      query: () => ({
        url: 'zones',
        method: 'GET',
      }),

      transformResponse: (response: any): ZoneResponse => ({
        status: response.status,
        data: response.data ?? [],
      }),

      providesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Get Single Zone
    // ------------------------------------------------------------

    getSingleZone: builder.query<Zone, number>({
      query: (id) => `zones/${id}`,

      transformResponse: (response: any): Zone => {
        return response.data ?? response;
      },

      providesTags: ['zones'],
    }),

    // ------------------------------------------------------------
    // Create Zone
    // ------------------------------------------------------------

    createZone: builder.mutation<
      Zone,
      {
        region_id: number;
        name: string;
        status: number;
      }
    >({
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
        data: {
          region_id: number;
          name: string;
          status: number;
        };
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