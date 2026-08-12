import { api } from "../api/baseApi";

export const employeeLocationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Employee Location List (Pagination + Filter)
    // ===========================
    getEmployeeLocations: builder.query({
      query: ({
        page = 1,
        per_page = 10,
        employee_id = "",
        search = "",
        from_date = "",
        to_date = "",

      }) => ({
        url: "/employee-locations",
        method: "GET",
        params: {
          page,
          per_page,
          employee_id,
          search,
          from_date,
          to_date,
          
        },
      }),
      providesTags: ["employeeLocations"],
    }),

    // ===========================
    // Employee Location Details
    // ===========================
    getEmployeeLocation: builder.query({
      query: (id) => ({
        url: `/employee-locations/${id}`,
        method: "GET",
      }),
      providesTags: ["employeeLocations"],
    }),

    // ===========================
    // Create Employee Location
    // ===========================
    createEmployeeLocation: builder.mutation({
      query: (data) => ({
        url: "/employee-locations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employeeLocations"],
    }),

    // ===========================
    // Update Employee Location
    // ===========================
    updateEmployeeLocation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employee-locations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employeeLocations"],
    }),

    // ===========================
    // Delete Employee Location
    // ===========================
    deleteEmployeeLocation: builder.mutation({
      query: (id) => ({
        url: `/employee-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employeeLocations"],
    }),

    getLocationEmployees: builder.query({
      query: (search = "") => ({
        url: "/locations/employees",
        method: "GET",
        params: {
          search,
        },
      }),
      transformResponse: (response: any) => response.data,
    }),

    getEmployeeLocationHistory: builder.query({
      query: ({
        employee_id,
        date,
      }) => ({
        url: "/locations/history",
        method: "POST",
        body: {
          employee_id,
          date,
        },
      }),
    }),

  }),
});

export const {
  useGetEmployeeLocationsQuery,
  useGetEmployeeLocationQuery,
  useCreateEmployeeLocationMutation,
  useUpdateEmployeeLocationMutation,
  useDeleteEmployeeLocationMutation,
  useGetLocationEmployeesQuery, 
  useGetEmployeeLocationHistoryQuery,
} = employeeLocationSlice;