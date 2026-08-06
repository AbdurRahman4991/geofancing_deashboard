import { api } from "../api/baseApi";

export const roleSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------- GET ROLES ----------------
    getRoles: builder.query({
      query: () => "roles",
      providesTags: ["role"],
    }),

    // ---------------- SINGLE ROLE ----------------
    getSingleRole: builder.query({
      query: (id) => `roles/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: ["role"],
    }),

    // ---------------- CREATE ROLE ----------------
    createRole: builder.mutation({
      query: (data) => ({
        url: "roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),

    // ---------------- UPDATE ROLE ----------------
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),

    // ---------------- DELETE ROLE ----------------
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),

    // ---------------- ASSIGN ROLE TO USER ----------------
    assignRole: builder.mutation({
      query: ({ userId, roles }) => ({
        url: `users/${userId}/assign-role`,
        method: "POST",
        body: {
          roles,
        },
      }),
      invalidatesTags: ["role", "user"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetSingleRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignRoleMutation,
} = roleSlice;