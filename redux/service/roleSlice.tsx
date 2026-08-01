import { api } from "../api/baseApi";

export const roleSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => "roles",
      providesTags: ["role"],
    }),

    getSingleRole: builder.query({
      query: (id) => `roles/${id}`,
      providesTags: ["role"],
    }),

    createRole: builder.mutation({
      query: (data) => ({
        url: "roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),

    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetSingleRoleQuery,
} = roleSlice;