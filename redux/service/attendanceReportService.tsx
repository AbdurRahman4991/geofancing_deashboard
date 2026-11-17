import { api } from '../api/baseApi';
import type { MarketVisitReportPeriod } from './marketVisitReportService';

export type AttendanceReportStatus = 'checked_in' | 'checked_out' | 'absent' | 'leave' | string;

export interface AttendanceReportParams {
  period?: MarketVisitReportPeriod;
  from_date?: string;
  to_date?: string;
  user_id?: number | string | null;
  hierarchy_level_id?: number | string | null;
  hierarchy_node_id?: number | string | null;
  status?: AttendanceReportStatus | null;
  page?: number;
  per_page?: number;
}

export interface AttendanceReportRow {
  id: number;
  company_id: number;
  user_id: number;
  check_in_date: string;
  check_in_time: string | null;
  check_in_latitude: string | null;
  check_in_longitude: string | null;
  check_out_time: string | null;
  check_out_latitude: string | null;
  check_out_longitude: string | null;
  work_hour: string | null;
  late: string | null;
  status: string;
  remarks: string | null;
  employee_name: string | null;
  employee_email: string | null;
  hierarchy_node_id: number | null;
  hierarchy_node_name: string | null;
  hierarchy_level_id: number | null;
  hierarchy_level_name: string | null;
}

export interface AttendanceReportResponse {
  message: string;
  filters: {
    period: string;
    from_date: string;
    to_date: string;
    user_id: number | null;
    hierarchy_level_id: number | null;
    hierarchy_node_id: number | null;
    status: string | null;
  };
  summary: {
    total_attendance: number;
    checked_in: number;
    checked_out: number;
    absent: number;
    leave_count: number;
    late_count: number;
  };
  data: AttendanceReportRow[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface AttendanceReportExportParams extends AttendanceReportParams {
  export: 'pdf' | 'excel';
}

export const attendanceReportService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceReport: builder.query<AttendanceReportResponse, AttendanceReportParams>({
      query: (params) => ({
        url: '/report-attendances',
        method: 'GET',
        params,
      }),
      providesTags: ['AttendanceReport'],
    }),
    exportAttendanceReport: builder.mutation<Blob, AttendanceReportExportParams>({
      query: ({ export: exportFormat, ...params }) => ({
        url: '/report-attendances',
        method: 'GET',
        params: { ...params, export: exportFormat },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetAttendanceReportQuery, useExportAttendanceReportMutation } =
  attendanceReportService;
