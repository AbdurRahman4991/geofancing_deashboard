
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

  // Nested Division
  division?: {
    id: number;
    zone_id: number;
    name: string;
    status: number;
    created_at?: string;
    updated_at?: string;
  };
}

// ----------------------------------------------------------------------
// District List Response
// ----------------------------------------------------------------------

export interface DistrictResponse {
  status: number;
  data: District[];
}

// ----------------------------------------------------------------------
// District Slice
// ----------------------------------------------------------------------

export const districtSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ==============================================================
    // Get All Districts
    // ==============================================================

    getDistricts: builder.query<DistrictResponse, void>({
      query: () => ({
        url: "districts",
        method: "GET",
      }),

      transformResponse: (
        response: any
      ): DistrictResponse => ({
        status: response.status,
        data: response.data,
      }),

      providesTags: ["districts"],
    }),

    // ==============================================================
    // Get Single District
    // ==============================================================

    getSingleDistrict: builder.query<District, number>({
      query: (id) => ({
        url: `districts/${id}`,
        method: "GET",
      }),

      transformResponse: (
        response: any
      ): District => response.data ?? response,

      providesTags: ["districts"],
    }),

    // ==============================================================
    // Create District
    // ==============================================================

    createDistrict: builder.mutation<
      District,
      {
        division_id: number;
        name: string;
        status: number;
      }
    >({
      query: (body) => ({
        url: "districts",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: any
      ): District => response.data ?? response,

      invalidatesTags: ["districts"],
    }),

    // ==============================================================
    // Update District
    // ==============================================================

    updateDistrict: builder.mutation<
      District,
      {
        id: number;
        data: {
          division_id: number;
          name: string;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `districts/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (
        response: any
      ): District => response.data ?? response,

      invalidatesTags: ["districts"],
    }),

    // ==============================================================
    // Delete District
    // ==============================================================

    deleteDistrict: builder.mutation<void, number>({
      query: (id) => ({
        url: `districts/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["districts"],
    }),
  }),
});

// ----------------------------------------------------------------------
// Export Hooks
// ----------------------------------------------------------------------

export const {
  useGetDistrictsQuery,
  useGetSingleDistrictQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
} = districtSlice;

