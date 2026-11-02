import { api } from '../api/baseApi';

export interface OrderProduct {
  id: number;
  product_name: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: string | number;
  unit_price: string | number;
  line_total: string | number;
  created_at: string;
  updated_at: string;
  product: OrderProduct | null;
}

export interface OrderGeofence {
  id: number;
  firm_name: string;
  address: string | null;
  image_url: string;
  media: unknown[];
}

export interface Order {
  id: number;
  company_id: number;
  geofence_id: number;
  created_by: number;
  order_number: string;
  status: string;
  notes: string | null;
  total: string | number;
  created_at: string;
  updated_at: string;
  geofence: OrderGeofence | null;
  items: OrderItem[];
}

export interface OrderPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface OrderPage {
  current_page: number;
  data: Order[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: OrderPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface OrderListResponse {
  message: string;
  data: OrderPage;
}

export interface GetOrdersParams {
  company_id: number | string;
  page?: number;
  per_page?: number;
}

export type OrderStatus = 'pending' | 'cancelled' | 'delivered';

export interface UpdateOrderStatusArgs {
  id: number;
  company_id: number | string;
  status: OrderStatus;
}

export interface OrderStatusMutationResponse {
  message: string;
  data?: Order;
}

export const orderSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, GetOrdersParams>({
      query: ({ company_id, page = 1, per_page = 10 }) => ({
        url: 'orders',
        params: { company_id, page, per_page },
      }),
      providesTags: ['orders'],
    }),
    updateOrderStatus: builder.mutation<OrderStatusMutationResponse, UpdateOrderStatusArgs>({
      query: ({ id, company_id, status }) => ({
        url: `orders/${id}`,
        method: 'PATCH',
        params: { company_id },
        body: { status },
      }),
      invalidatesTags: ['orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = orderSlice;

