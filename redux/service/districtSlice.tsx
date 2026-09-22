import { api } from "../api/baseApi";

// ----------------------------------------------------------------------
// Division Interface
// ----------------------------------------------------------------------

export interface Division {
  id: number;
  zone_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------
// District Interface
// ----------------------------------------------------------------------

export interface District {
  id: number;
  division_id: number;
  name: string;
  code?: string;
  status: number;
  created_at?: string;
  updated_at?: string;

  // Nested Division
  division?: Division;
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
// District List Response
// ----------------------------------------------------------------------

export interface DistrictResponse {
  status: number;

  data: PaginationData & {
    data: District[];
  };
}

// ----------------------------------------------------------------------
// District Query Parameters
// ----------------------------------------------------------------------

export interface DistrictQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  division_id?: number;
}

// ----------------------------------------------------------------------
// District Slice
// ----------------------------------------------------------------------

export const districtSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ==============================================================
    // Get Districts - Search + Filter + Pagination
    // ==============================================================

    getDistricts: builder.query<
      DistrictResponse,
      DistrictQueryParams | void
    >({
      query: (params) => ({
        url: "districts",
        method: "GET",

        params: {
          page: params?.page,
          per_page: params?.per_page,
          search: params?.search,
          division_id: params?.division_id,
        },
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
        code?: string;
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
          code?: string;
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