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

  // Nested District
  district?: {
    id: number;
    division_id: number;
    name: string;
    status: number;
    created_at?: string;
    updated_at?: string;
  };
}

// ----------------------------------------------------------------------
// SubDistrict List Response
// ----------------------------------------------------------------------

export interface SubDistrictResponse {
  status: number;
  data: SubDistrict[];
}

// ----------------------------------------------------------------------
// SubDistrict Slice
// ----------------------------------------------------------------------

export const subDistrictSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ==============================================================
    // Get All SubDistricts
    // ==============================================================

    getSubDistricts: builder.query<SubDistrictResponse, void>({
      query: () => ({
        url: "sub-districts",
        method: "GET",
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

    getSingleSubDistrict: builder.query<SubDistrict, number>({
      query: (id) => ({
        url: `sub-districts/${id}`,
        method: "GET",
      }),

      transformResponse: (
        response: any
      ): SubDistrict => response.data ?? response,

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
      ): SubDistrict => response.data ?? response,

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
      ): SubDistrict => response.data ?? response,

      invalidatesTags: ["subDistricts"],
    }),

    // ==============================================================
    // Delete SubDistrict
    // ==============================================================

    deleteSubDistrict: builder.mutation<void, number>({
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