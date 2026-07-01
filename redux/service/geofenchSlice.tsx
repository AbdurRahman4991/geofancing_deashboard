import { api } from "../api/baseApi";

export interface Geofence {
  id: number;
  company_id: number;
  user_id: number;
  latitude: string;
  longitude: string;
  radius: number;
  company?: {
    id: number;
    company_name: string;
    avatar_url: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

export interface GeofenceRequest {
  company_id: number;
  user_id: number;
  latitude: string;
  longitude: string;
  radius: number;
}

export const geofenceSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ============================
    // Get Geofence List
    // ============================
    getGeofences: builder.query<
      { data: Geofence[]; pagination: any },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `geofences?page=${page}&limit=${limit}&search=${search}`,

      transformResponse: (response: any) => ({
        data: response.data.data, // actual list
        pagination: {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page,
        },
      }),

      providesTags: ["geofences"],
    }),

    // ============================
    // Get Single Geofence
    // ============================
    // getSingleGeofence: builder.query<Geofence, string>({
    //   query: (id) => `geofences/${id}`,
    //   transformResponse: (response: any) => response.data,
    //   providesTags: ["geofences"],
    // }),
getSingleGeofence: builder.query<Geofence, string>({
  query: (id) => `geofences/${id}`,
  transformResponse: (response: any) => response, // ✅ IMPORTANT
}),





    // ============================
    // Create Geofence
    // ============================
    createGeofence: builder.mutation<Geofence, GeofenceRequest>({
      query: (data) => ({
        url: "geofences",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["geofences"],
    }),

    // ============================
    // Update Geofence
    // ============================
    updateGeofence: builder.mutation({
      query: ({ id, data }) => ({
        url: `geofences/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["geofences"],
    }),

    // ============================
    // Delete Geofence
    // ============================
    deleteGeofence: builder.mutation<void, string>({
      query: (id) => ({
        url: `geofences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["geofences"],
    }),
  }),
});

export const {
  useGetGeofencesQuery,
  useGetSingleGeofenceQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useDeleteGeofenceMutation,
} = geofenceSlice;
