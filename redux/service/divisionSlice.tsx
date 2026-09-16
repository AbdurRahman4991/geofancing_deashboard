
import { api } from "../api/baseApi";

// ==============================
// Interfaces
// ==============================

export interface Zone {
  id: number;
  region_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface Division {
  id: number;
  zone_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;

  // Relation
  zone?: Zone | null;
}

export interface DivisionResponse {
  status: number;
  data: Division[];
}

export interface DivisionRequest {
  zone_id: number;
  name: string;
  status: number;
}

// ==============================
// API
// ==============================

export const divisionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================
    // Get Division List
    // ==========================

    getDivisions: builder.query<DivisionResponse, void>({
      query: () => ({
        url: "divisions",
        method: "GET",
      }),

      transformResponse: (response: any): DivisionResponse => ({
        status: response.status,
        data: response.data,
      }),

      providesTags: ["divisions"],
    }),

    // ==========================
    // Get Single Division
    // ==========================

    getSingleDivision: builder.query<Division, number>({
      query: (id) => `divisions/${id}`,

      transformResponse: (response: any): Division => {
        return response.data ?? response;
      },

      providesTags: ["divisions"],
    }),

    // ==========================
    // Create Division
    // ==========================

    createDivision: builder.mutation<
      Division,
      DivisionRequest
    >({
      query: (body) => ({
        url: "divisions",
        method: "POST",
        body,
      }),

      transformResponse: (response: any): Division => {
        return response.data ?? response;
      },

      invalidatesTags: ["divisions"],
    }),

    // ==========================
    // Update Division
    // ==========================

    updateDivision: builder.mutation<
      Division,
      {
        id: number;
        data: DivisionRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `divisions/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (response: any): Division => {
        return response.data ?? response;
      },

      invalidatesTags: ["divisions"],
    }),

    // ==========================
    // Delete Division
    // ==========================

    deleteDivision: builder.mutation<void, number>({
      query: (id) => ({
        url: `divisions/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["divisions"],
    }),
  }),
});

// ==============================
// Hooks
// ==============================

export const {
  useGetDivisionsQuery,
  useGetSingleDivisionQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} = divisionSlice;
