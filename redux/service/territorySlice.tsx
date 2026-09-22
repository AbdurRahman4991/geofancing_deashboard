import { api } from "../api/baseApi";

// ----------------------------------------------------------------------
// SubDistrict Interface
// ----------------------------------------------------------------------

export interface SubDistrict {
  id: number;
  district_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------
// Territory Interface
// ----------------------------------------------------------------------

export interface Territory {
  id: number;
  sub_district_id: number;
  name: string;
  code?: string;
  status: number;
  created_at?: string;
  updated_at?: string;

  sub_district?: SubDistrict;
}

// ----------------------------------------------------------------------
// Pagination Interface
// ----------------------------------------------------------------------

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

// ----------------------------------------------------------------------
// Territory List Response
// ----------------------------------------------------------------------

export interface TerritoryResponse {
  status: number;
  data: {
    data: Territory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

// ----------------------------------------------------------------------
// Territory Slice
// ----------------------------------------------------------------------

export const territorySlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ==============================================================
    // Get Territories - Search + Filter + Pagination
    // ==============================================================

    getTerritories: builder.query<
      TerritoryResponse,
      {
        page?: number;
        per_page?: number;
        search?: string;
        sub_district_id?: number;
      } | void
    >({
      query: (params) => ({
        url: "territories",
        method: "GET",

        params: {
          page: params?.page,
          per_page: params?.per_page,
          search: params?.search,
          sub_district_id: params?.sub_district_id,
        },
      }),

      transformResponse: (
        response: any
      ): TerritoryResponse => ({
        status: response.status,
        data: response.data,
      }),

      providesTags: ["territories"],
    }),

    // ==============================================================
    // Get Single Territory
    // ==============================================================

    getSingleTerritory: builder.query<Territory, number>({
      query: (id) => ({
        url: `territories/${id}`,
        method: "GET",
      }),

      transformResponse: (
        response: any
      ): Territory => response.data ?? response,

      providesTags: ["territories"],
    }),

    // ==============================================================
    // Create Territory
    // ==============================================================

    createTerritory: builder.mutation<
      Territory,
      {
        sub_district_id: number;
        name: string;
        code?: string;
        status: number;
      }
    >({
      query: (body) => ({
        url: "territories",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: any
      ): Territory => response.data ?? response,

      invalidatesTags: ["territories"],
    }),

    // ==============================================================
    // Update Territory
    // ==============================================================

    updateTerritory: builder.mutation<
      Territory,
      {
        id: number;
        data: {
          sub_district_id: number;
          name: string;
          code?: string;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `territories/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (
        response: any
      ): Territory => response.data ?? response,

      invalidatesTags: ["territories"],
    }),

    // ==============================================================
    // Delete Territory
    // ==============================================================

    deleteTerritory: builder.mutation<void, number>({
      query: (id) => ({
        url: `territories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["territories"],
    }),
  }),
});

// ----------------------------------------------------------------------
// Export Hooks
// ----------------------------------------------------------------------

export const {
  useGetTerritoriesQuery,
  useGetSingleTerritoryQuery,
  useCreateTerritoryMutation,
  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
} = territorySlice;