import { api } from "../api/baseApi";

export interface DepartmentCompany {
  id: number;
  company_name: string;
  avatar_url: string;
  media: unknown[];
}

export interface Department {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  company?: DepartmentCompany | null;
}

export interface DepartmentPagination {
  current_page: number;
  data: Department[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface DepartmentListResponse {
  message: string;
  data: DepartmentPagination;
}

export interface DepartmentQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  company_id?: number;
  status?: string;
}

export interface DepartmentRequest {
  company_id: number;
  name: string;
  description?: string | null;
  status: string;
}

export const departmentsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentListResponse, DepartmentQueryParams | void>({
      query: (params) => ({
        url: "departments/",
        method: "GET",
        params: {
          page: params?.page,
          per_page: params?.per_page,
          search: params?.search,
          company_id: params?.company_id,
          status: params?.status,
        },
      }),
      providesTags: ["departments"],
    }),

    getSingleDepartment: builder.query<Department, number>({
      query: (id) => ({
        url: `departments/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: { data?: Department } | Department) =>
        "data" in response && response.data ? response.data : response as Department,
      providesTags: (_result, _error, id) => [{ type: "departments", id }],
    }),

    createDepartment: builder.mutation<Department, DepartmentRequest>({
      query: (body) => ({
        url: "departments/",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data?: Department } | Department) =>
        "data" in response && response.data ? response.data : response as Department,
      invalidatesTags: ["departments"],
    }),

    updateDepartment: builder.mutation<Department, { id: number; data: DepartmentRequest }>({
      query: ({ id, data }) => ({
        url: `departments/${id}/`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data?: Department } | Department) =>
        "data" in response && response.data ? response.data : response as Department,
      invalidatesTags: (_result, _error, { id }) => ["departments", { type: "departments", id }],
    }),

    deleteDepartment: builder.mutation<void, number>({
      query: (id) => ({
        url: `departments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => ["departments", { type: "departments", id }],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetSingleDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsSlice;
