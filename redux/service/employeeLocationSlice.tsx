import { api } from "../api/baseApi";

export interface EmployeeLocation {
  id: number;
  user_id: number;
  company_id: number;
  latitude: string;
  longitude: string;
  activity_type: string | null;
  transport_mode: string | null;
  speed: number | string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string | null;
    employee_id: number | string | null;
    company_id: number | string | null;
    employee: {
      id: number;
      name: string;
      employee_id: string;
    } | null;
  } | null;
}

export interface EmployeeLocationPagination {
  current_page: number;
  data: EmployeeLocation[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; page: number | null; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface EmployeeLocationParams {
  page?: number;
  per_page?: number;
  user_id?: number | string;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface EmployeeLocationTrackPoint {
  latitude: number | string;
  longitude: number | string;
  accuracy: number | null;
  speed: number | string | null;
  recorded_at: string;
}

export interface EmployeeLocationSegment {
  points: EmployeeLocationTrackPoint[];
}

export interface EmployeeLocationSegmentsResponse {
  status: boolean;
  date: string;
  user: {
    id: number;
    name: string;
    employee_id: number | string;
    company_id: number | string;
  };
  segments: EmployeeLocationSegment[];
}

export const employeeLocationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Employee Location List (Pagination + Filter)
    // ===========================
    getEmployeeLocations: builder.query<EmployeeLocationPagination, EmployeeLocationParams>({
      query: ({
        page = 1,
        per_page = 10,
        user_id = "",
        search = "",
        from_date = "",
        to_date = "",

      }) => ({
        url: "/employee-locations",
        method: "GET",
        params: {
          page,
          per_page,
          user_id,
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

    getEmployeeLocationHistory: builder.query<
      EmployeeLocationSegmentsResponse,
      { user_id: string | number; date?: string }
    >({
      query: ({ user_id, date }) => ({
        url: "/employee-locations/segments",
        method: "GET",
        params: { user_id, ...(date ? { date } : {}) },
      }),
    }),

    getLatestEmployeeLocation: builder.query<any, { user_id: string | number; refreshKey: number }>({
      query: ({ user_id, refreshKey }) => ({
        url: "/employee-locations",
        method: "GET",
        params: { user_id, per_page: 1, _refresh: refreshKey },
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
  useLazyGetLatestEmployeeLocationQuery,
} = employeeLocationSlice;



