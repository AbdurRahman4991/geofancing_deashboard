import { api } from '../api/baseApi';
import type { MarketVisitReportPeriod } from './marketVisitReportService';

export interface MonthlyPerformanceReportParams {
  period?: MarketVisitReportPeriod;
  from_date?: string;
  to_date?: string;
  hierarchy_level_id?: number | string | null;
  hierarchy_node_id?: number | string | null;
  user_id?: number | string | null;
  page?: number;
  per_page?: number;
}

export interface MonthlyPerformanceEmployee {
  user_id: number;
  employee_name: string;
  employee_id: number | string;
  attendance: {
    working_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    checkout_days: number;
    attendance_rate: number;
  };
  field_visits: {
    total_visits: number;
    completed_visits: number;
    incomplete_visits: number;
    unique_customers: number;
    total_visit_duration: number;
  };
  working_hours: {
    total_hours: number;
    average_hours: number;
  };
  sales: {
    total_orders: number;
    total_order_items: number;
    total_quantity: number;
    total_sales: number;
    average_order_value: number;
    ordering_customers: number;
  };
  target_achievement: {
    sales_target: number | null;
    achieved_sales: number;
    achievement_percentage: number | null;
    remaining_target: number | null;
    visit_target: number | null;
    visit_achievement_percentage: number | null;
    target: number;
    achieved: number;
    percentage: number;
  };
}

export interface MonthlyPerformanceReportResponse {
  success: boolean;
  message: string;
  filters: {
    period: string;
    from_date: string;
    to_date: string;
    hierarchy_level_id: number | null;
    hierarchy_node_id: number | null;
    user_id: number | null;
  };
  summary: {
    total_employees: number;
    total_present_days: number;
    total_absent_days: number;
    total_late_days: number;
    total_market_visits: number;
    total_orders: number;
    total_sales: number;
  };
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
  data: MonthlyPerformanceEmployee[];
}

export interface MonthlyPerformanceReportExportParams extends MonthlyPerformanceReportParams {
  export: 'pdf' | 'excel';
}

export const monthlyPerformanceReportService = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyPerformanceReport: builder.query<
      MonthlyPerformanceReportResponse,
      MonthlyPerformanceReportParams
    >({
      query: (params) => ({
        url: '/reports/monthly-performance',
        method: 'GET',
        params,
      }),
      providesTags: ['MonthlyPerformanceReport'],
    }),
    exportMonthlyPerformanceReport: builder.mutation<Blob, MonthlyPerformanceReportExportParams>({
      query: ({ export: exportFormat, ...params }) => ({
        url: '/reports/monthly-performance',
        method: 'GET',
        params: { ...params, export: exportFormat },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetMonthlyPerformanceReportQuery, useExportMonthlyPerformanceReportMutation } =
  monthlyPerformanceReportService;
