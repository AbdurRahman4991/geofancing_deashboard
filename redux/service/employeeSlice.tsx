import { api } from "../api/baseApi";

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Employee List
    // ===========================
    getEmployees: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        name = "",
        department = "",
        search = "",
      }) => ({
        url: "/employees",
        method: "GET",
        params: {
          page,
          per_page,
          name,
          department,
          search 
        },
      }),
      providesTags: ["employees"],
    }),

    // ===========================
    // Employee Details
    // ===========================
    getEmployee: builder.query({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "GET",
      }),
      providesTags: ["employees"],
    }),

    // ===========================
    // Sync Employee From ERP
    // ===========================
    syncEmployee: builder.mutation({
      query: () => ({
        url: "/employees/sync",
        method: "POST",
      }),
      invalidatesTags: ["employees"],
    }),

    // ===========================
    // Create Employee
    // ===========================
    createEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employees"],
    }),

    // ===========================
    // Update Employee
    // ===========================
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employees"],
    }),

    // ===========================
    // Delete Employee
    // ===========================
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSyncEmployeeMutation,
} = employeeApi;