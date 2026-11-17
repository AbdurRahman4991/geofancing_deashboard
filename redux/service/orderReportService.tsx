import { api } from '../api/baseApi';

export interface OrderReportParams {
  from_date?: string | null;
  to_date?: string | null;
  category_id?: number | string | null;
  sub_category_id?: number | string | null;
  brand_id?: number | string | null;
  product_id?: number | string | null;
  hierarchy_level_id?: number | string | null;
  hierarchy_node_id?: number | string | null;
  user_id?: number | string | null;
  geofence_id?: number | string | null;
  status?: string | null;
  page?: number;
  per_page?: number;
}

export interface OrderReportItem {
  id: number;
  quantity: number | string;
  unit_price: number | string;
  line_total: number | string;
  product: {
    id: number;
    product_name: string;
    category: { id: number; name: string } | null;
    sub_category: { id: number; name: string } | null;
    brand: { id: number; name: string } | null;
  } | null;
}

export interface OrderReportRow {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  total: number | string;
  notes: string | null;
  employee: { id: number; name: string; email: string } | null;
  geofence: { id: number; firm_name: string; address: string | null } | null;
  items: OrderReportItem[];
}

export interface OrderReportResponse {
  success: boolean;
  message: string;
  filters: Record<string, string | number | null>;
  summary: {
    total_orders: number;
    total_quantity: number | string;
    total_amount: number | string;
    total_employees: number;
  };
  data: OrderReportRow[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface OrderReportExportParams extends OrderReportParams {
  export: 'pdf' | 'excel';
}

export const orderReportService = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrderReport: builder.query<OrderReportResponse, OrderReportParams>({
      query: (params) => ({
        url: '/report-orders',
        method: 'GET',
        params,
      }),
      providesTags: ['OrderReport'],
    }),
    exportOrderReport: builder.mutation<Blob, OrderReportExportParams>({
      query: ({ export: exportFormat, ...params }) => ({
        url: '/report-orders',
        method: 'GET',
        params: { ...params, export: exportFormat },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetOrderReportQuery, useExportOrderReportMutation } = orderReportService;
