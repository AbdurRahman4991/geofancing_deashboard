import { api } from "../api/baseApi";


// ==============================
// Interfaces
// ==============================

export interface Company {
  id: number;
  company_name: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Geofence {
  id: number;
  company_id: number;
  user_id: number;
  latitude: string;
  longitude: string;
  radius: number;
  created_at?: string;
  updated_at?: string;

  company?: Company | null;
  user?: User | null;
}

export interface GeofenceRequest {
  company_id: number;
  user_id: number;
  latitude: string;
  longitude: string;
  radius: number;
}

export interface GeofenceResponse {
  data: Geofence[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

// ==============================
// API
// ==============================

export const geofenceSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================
    // Get Geofence List
    // ==========================
    getGeofences: builder.query<
      GeofenceResponse,
      {
        page?: number;
        per_page?: number;
        user_id?: number | string;
        search?: string;
        company_id?: number | string;
      }
    >({
      query: ({ page = 1, per_page = 10, user_id = "", search= "", company_id="", }) => ({
        url: "geofences",
        params: {
          page,
          per_page,
          user_id,
          search,
          company_id
          
        },
      }),

      transformResponse: (response: any) => ({
        data: response.data,
        pagination: {
          current_page: response.current_page,
          total: response.total,
          per_page: response.per_page,
          last_page: response.last_page,
        },
      }),

      providesTags: ["geofences"],
    }),

    // ==========================
    // Get Single Geofence
    // ==========================
    getSingleGeofence: builder.query<Geofence, number>({
      query: (id) => `geofences/${id}`,
      transformResponse: (response: any) => response.data ?? response,
      providesTags: ["geofences"],
    }),

    // ==========================
    // Create
    // ==========================
    createGeofence: builder.mutation<Geofence, GeofenceRequest>({
      query: (body) => ({
        url: "geofences",
        method: "POST",
        body,
      }),
      invalidatesTags: ["geofences"],
    }),

    // ==========================
    // Update
    // ==========================
    updateGeofence: builder.mutation<
      Geofence,
      {
        id: number;
        data: GeofenceRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `geofences/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["geofences"],
    }),

    // ==========================
    // Delete
    // ==========================
    deleteGeofence: builder.mutation<void, number>({
      query: (id) => ({
        url: `geofences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["geofences"],
    }),
  }),
});

// ==============================
// Hooks
// ==============================

export const {
  useGetGeofencesQuery,
  useGetSingleGeofenceQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useDeleteGeofenceMutation,
} = geofenceSlice;