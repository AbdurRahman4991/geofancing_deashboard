import { api } from "../api/baseApi";

// ----------------------------------------------------------------------
// District Interface
// ----------------------------------------------------------------------

export interface District {
  id: number;
  division_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------
// SubDistrict Interface
// ----------------------------------------------------------------------

export interface SubDistrict {
  id: number;
  district_id: number;
  name: string;
  code?: string;
  status: number;
  created_at?: string;
  updated_at?: string;

  // Nested District
  district?: District;
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
// SubDistrict List Response
// ----------------------------------------------------------------------

export interface SubDistrictResponse {
  status: number;

  data: PaginationData & {
    data: SubDistrict[];
  };
}

// ----------------------------------------------------------------------
// Query Params
// ----------------------------------------------------------------------

export interface SubDistrictQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  district_id?: number;
}

// ----------------------------------------------------------------------
// SubDistrict Slice
// ----------------------------------------------------------------------

export const subDistrictSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ==============================================================
    // Get SubDistricts
    // Search + District Filter + Pagination
    // ==============================================================

    getSubDistricts: builder.query<
      SubDistrictResponse,
      SubDistrictQueryParams | void
    >({
      query: (params) => ({
        url: "sub-districts",
        method: "GET",

        params: {
          page: params?.page,
          per_page: params?.per_page,
          search: params?.search,
          district_id: params?.district_id,
        },
      }),

      transformResponse: (
        response: any
      ): SubDistrictResponse => ({
        status: response.status,
        data: response.data,
      }),

      providesTags: ["subDistricts"],
    }),

    // ==============================================================
    // Get Single SubDistrict
    // ==============================================================

    getSingleSubDistrict: builder.query<
      SubDistrict,
      number
    >({
      query: (id) => ({
        url: `sub-districts/${id}`,
        method: "GET",
      }),

      transformResponse: (
        response: any
      ): SubDistrict =>
        response.data ?? response,

      providesTags: ["subDistricts"],
    }),

    // ==============================================================
    // Create SubDistrict
    // ==============================================================

    createSubDistrict: builder.mutation<
      SubDistrict,
      {
        district_id: number;
        name: string;
        code?: string;
        status: number;
      }
    >({
      query: (body) => ({
        url: "sub-districts",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: any
      ): SubDistrict =>
        response.data ?? response,

      invalidatesTags: ["subDistricts"],
    }),

    // ==============================================================
    // Update SubDistrict
    // ==============================================================

    updateSubDistrict: builder.mutation<
      SubDistrict,
      {
        id: number;

        data: {
          district_id: number;
          name: string;
          code?: string;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `sub-districts/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (
        response: any
      ): SubDistrict =>
        response.data ?? response,

      invalidatesTags: ["subDistricts"],
    }),

    // ==============================================================
    // Delete SubDistrict
    // ==============================================================

    deleteSubDistrict: builder.mutation<
      void,
      number
    >({
      query: (id) => ({
        url: `sub-districts/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["subDistricts"],
    }),
  }),
});

// ----------------------------------------------------------------------
// Export Hooks
// ----------------------------------------------------------------------

export const {
  useGetSubDistrictsQuery,
  useGetSingleSubDistrictQuery,
  useCreateSubDistrictMutation,
  useUpdateSubDistrictMutation,
  useDeleteSubDistrictMutation,
} = subDistrictSlice;