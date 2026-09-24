import { api } from "../api/baseApi";

export const permissionSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // Get All Permissions
    getPermissions: builder.query({
      query: () => "permissions",
      transformResponse: (response: any) => response.data,
      providesTags: ["permission"],
    }),

    // Grouped Permissions (Role Create/Edit)
    getPermissionGroups: builder.query({
      query: () => "permission-groups",
      transformResponse: (response: any) => response.data,
      providesTags: ["permission"],
    }),

    // Get Single Permission
    getSinglePermission: builder.query({
    query: (id) => `permissions/${id}`,
    providesTags: ["permission"],
    }),

    // Create Permission
    createPermission: builder.mutation({
      query: (data) => ({
        url: "permissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["permission"],
    }),

    // Update Permission
    updatePermission: builder.mutation({
      query: ({ id, data }) => ({
        url: `permissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["permission"],
    }),

    // Delete Permission
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["permission"],
    }),

    assignPermission: builder.mutation({
      query: ({ roleId, permissions }) => ({
        url: `roles/${roleId}/assign-permission`,
        method: "POST",
        body: {
          permissions,
        },
      }),
      invalidatesTags: ["permission", "role"],
    }),


    getRolePermissions: builder.query({
    query: (roleId) => `roles/${roleId}/permissions`,
    transformResponse: (response: any) => response.data,
    providesTags: ["permission"],
    }),

  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionGroupsQuery,
  useGetSinglePermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useAssignPermissionMutation,
  useGetRolePermissionsQuery,
} = permissionSlice;