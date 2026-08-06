import { api } from "../api/baseApi";

export interface EmployeeResponse {
  data: any[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Employee List
    // ===========================
    getEmployees: builder.query<
      EmployeeResponse,
      {
        page?: number;
        per_page?: number;
        name?: string;
        department?: string;
        search?: string;
      }
    >({
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
          search,
        },
      }),

      transformResponse: (response: any) => ({
        data: response.data.data,
        pagination: {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page,
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

      transformResponse: (response: any) => response.data,

      providesTags: ["employees"],
    }),

    // ===========================
    // Sync Employee
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