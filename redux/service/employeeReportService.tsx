import { api } from '../api/baseApi';

export type EmployeeRegistrationFilter = 'both' | 'registered' | 'unregistered';
export type EmployeeStatusFilter = 'active' | 'inactive';

export interface EmployeeReportParams {
  company_id: number | string;
  registration_status?: EmployeeRegistrationFilter;
  employee_status?: EmployeeStatusFilter | null;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface EmployeeReportExportParams extends EmployeeReportParams {
  export: 'pdf' | 'excel';
}

export interface EmployeeReportRow {
  id: number;
  employee_id: string;
  employee_name: string;
  phone: string | null;
  email: string | null;
  company_id: number;
  employee_status: string;
  company_name: string;
  user_id: number | null;
  device_id: string | null;
  user_status: string | null;
  registered_at: string | null;
  registration_status: 'Registered' | 'Unregistered' | string;
}

export interface EmployeeReportResponse {
  success: boolean;
  message: string;
  filters: {
    company_id: number | string;
    registration_status: string;
    employee_status: string | null;
    search: string | null;
    per_page: number;
  };
  summary: {
    total_employees: number;
    registered_employees: number;
    unregistered_employees: number;
    registration_rate: number;
  };
  data: {
    current_page: number;
    data: EmployeeReportRow[];
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export const employeeReportService = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeReport: builder.query<EmployeeReportResponse, EmployeeReportParams>({
      query: (params) => ({
        url: '/reports/employee',
        method: 'GET',
        params,
      }),
      providesTags: ['EmployeeRegistrationReport'],
    }),
    exportEmployeeReport: builder.mutation<Blob, EmployeeReportExportParams>({
      query: ({ export: exportFormat, ...params }) => ({
        url: '/reports/employee',
        method: 'GET',
        params: { ...params, export: exportFormat },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetEmployeeReportQuery, useExportEmployeeReportMutation } = employeeReportService;
