import { api } from '../api/baseApi'

// ============================
// Employee Interfaces
// ============================

export interface Employee {
  id: number;
  name: string;
  employee_id: string;
  company_id?: string;
  phone: string;

  status: string;
  nature_of_employment: string;

  department?: string;
  unit?: string;
  division?: string;
  designation?: string;
  reporting_person?: string;

  date_of_joining: string;

  email?: string;
  dob?: string;
  section_info?: string;
}

export interface EmployeeRequest {
  id?: string;
  name: string;
  employee_id: string;
  company_id?: string;
  phone: string;

  status: string;
  nature_of_employment: string;

  department?: string;
  unit?: string;
  division?: string;
  designation?: string;
  reporting_person?: string;

  date_of_joining: string;

  email?: string;
  dob?: string;
  section_info?: string;
}

// ============================
// Employee Slice
// ============================

export const employeeSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ============================
    // Get Employees List
    // ============================
    getEmployees: builder.query<
      { data: Employee[]; pagination: any },
      {
        page?: number;
        limit?: number;
        search?: string;
        orderBy?: string;
        order?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        orderBy = "id",
        order = "desc",
      }) =>
        `employees?page=${page}&limit=${limit}&search=${search}&orderBy=${orderBy}&order=${order}`,

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

    // ============================
    // Get Single Employee
    // ============================
    getSingleEmployee: builder.query<Employee, string>({
      query: (id) => `employees/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: ["employees"],
    }),

    // ============================
    // Create Employee
    // ============================
    createEmployee: builder.mutation<Employee, FormData>({
      query: (formData) => ({
        url: "employees",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["employees"],
    }),

    // ============================
    // Update Employee
    // ============================
    updateEmployee: builder.mutation({
      query: ({ id, data }) => {
        data.append("_method", "PUT"); // Laravel PUT support
        return {
          url: `employees/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    // ============================
    // Delete Employee
    // ============================
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetSingleEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation
} = employeeSlice;
