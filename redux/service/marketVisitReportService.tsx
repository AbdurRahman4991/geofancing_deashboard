import { api } from '../api/baseApi';

export type MarketVisitReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type MarketVisitStatus = 'all' | 'visited' | 'not_visited';

export interface MarketVisitReportParams {
  period?: MarketVisitReportPeriod;
  from_date?: string;
  to_date?: string;
  hierarchy_level_id?: number | string | null;
  hierarchy_node_id?: number | string | null;
  user_id?: number | string | null;
  visit_status?: MarketVisitStatus | string;
  page?: number;
  per_page?: number;
}

export interface MarketVisitReportExportParams extends MarketVisitReportParams {
  export: 'pdf' | 'excel';
}

export interface MarketVisitReportSummary {
  total_visits: number;
  total_employees: number;
  total_markets: number;
  visited_markets: number;
  none_visited_markets: number;
  completed_visits: number;
  active_visits: number;
  total_duration: string | number;
}

export interface MarketVisitReportRow {
  geofence_id: number;
  market_name: string;
  market_address: string | null;
  hierarchy_level_id: number | null;
  hierarchy_level: string | null;
  hierarchy_node_id: number | null;
  hierarchy_node: string | null;
  visit_id: number | null;
  user_id: number | null;
  employee_name: string | null;
  visit_start_time: string | null;
  visit_end_time: string | null;
  duration: string | number | null;
  check_in_latitude: string | number | null;
  check_in_longitude: string | number | null;
  check_out_latitude: string | number | null;
  check_out_longitude: string | number | null;
}

export interface MarketVisitReportPagination {
  current_page: number;
  data: MarketVisitReportRow[];
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
}

export interface MarketVisitReportResponse {
  success: boolean;
  message: string;
  filters: Omit<MarketVisitReportParams, 'page' | 'per_page'> & {
    period: string;
    from_date: string;
    to_date: string;
    hierarchy_level_id: number | null;
    hierarchy_node_id: number | null;
    user_id: number | null;
    visit_status: string;
  };
  summary: MarketVisitReportSummary;
  data: MarketVisitReportPagination;
}

export const marketVisitReportService = api.injectEndpoints({
  endpoints: (builder) => ({
    getMarketVisitReport: builder.query<MarketVisitReportResponse, MarketVisitReportParams | void>({
      query: (params) => ({
        url: '/report-market-visits',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['MarketVisitReport'],
    }),
    exportMarketVisitReport: builder.mutation<Blob, MarketVisitReportExportParams>({
      query: ({ export: exportFormat, ...params }) => ({
        url: '/report-market-visits',
        method: 'GET',
        params: { ...params, export: exportFormat },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetMarketVisitReportQuery,
  useLazyGetMarketVisitReportQuery,
  useExportMarketVisitReportMutation,
} = marketVisitReportService;
