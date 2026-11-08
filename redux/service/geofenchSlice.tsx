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
  hierarchy_node_id: number | null;
  firm_name: string;
  address: string | null;
  latitude: number | string;
  longitude: number | string;
  radius: number;
  created_at?: string;
  updated_at?: string;

  // Additional fields may be included by API resources and older clients.
  user_id?: number | null;
  visit_status?: string | null;
  company?: Company | null;
  user?: User | null;
}

export interface GeofenceRequest {
  company_id: number;
  hierarchy_node_id?: number | null;
  firm_name?: string;
  address?: string | null;
  latitude: number | string;
  longitude: number | string;
  radius: number;

  // Kept optional for existing screens that still send these fields.
  user_id?: number;
}

export interface GeofenceResponse {
  data: Geofence[];
  status?: number;
  message?: string;
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
        limit?: number;
        hierarchy_node_id?: number | string;
        search?: string;
        company_id?: number | string;
        user_id?: number | string;
      }
    >({
      query: ({ page = 1, per_page, limit, hierarchy_node_id, search= "", company_id="", user_id="", }) => ({
        url: "geofences",
        params: {
          page,
          per_page: per_page ?? limit ?? 10,
          hierarchy_node_id,         
          search,
          company_id,
          ...(user_id ? { user_id } : {}),
          
        },
      }),

      transformResponse: (response: any) => ({
        data: response.data.data,
        status: response.status,
        message: response.message,
        pagination: {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page,
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
