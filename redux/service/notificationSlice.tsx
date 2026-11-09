
import { api } from '../api/baseApi';

// =====================================================
// NOTIFICATION DATA
// =====================================================

export interface NotificationData {
  type: string;
  action?: string;
  title: string;
  message: string;

  assignment_id?: number;

  employee_user_id: number | string;
  employee_name: string;

  company_id: number;

  hierarchy_node_id: number | null;
  hierarchy_node_name: string | null;

  assigned_by: number;
}

// =====================================================
// NOTIFICATION ITEM
// =====================================================

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;

  read_at: string | null;

  created_at: string;
}

// =====================================================
// PAGINATION LINK
// =====================================================

export interface NotificationPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

// =====================================================
// PAGINATED RESPONSE
// =====================================================

export interface NotificationPagination {
  current_page: number;

  data: Notification[];

  first_page_url: string | null;

  from: number | null;

  last_page: number;

  last_page_url: string | null;

  links: NotificationPaginationLink[];

  next_page_url: string | null;

  path: string;

  per_page: number;

  prev_page_url: string | null;

  to: number | null;

  total: number;
}

// =====================================================
// API RESPONSE
// =====================================================

export interface NotificationResponse {
  status: boolean;

  unread_count: number;

  data: NotificationPagination;
}

// =====================================================
// QUERY PARAMS
// =====================================================

export interface NotificationQueryParams {
  page?: number;
  per_page?: number;
}

// =====================================================
// API
// =====================================================

export const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // =================================================
    // GET ALL NOTIFICATIONS
    // =================================================

    getNotifications: builder.query<
      NotificationResponse,
      NotificationQueryParams | void
    >({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params,
      }),

      providesTags: ['Notification'],
    }),

    // =================================================
    // MARK SINGLE NOTIFICATION AS READ
    // =================================================

    markNotificationAsRead: builder.mutation<
      any,
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),

      invalidatesTags: ['Notification'],
    }),

    // =================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =================================================

    markAllNotificationsAsRead: builder.mutation<
      any,
      void
    >({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),

      invalidatesTags: ['Notification'],
    }),

    // =================================================
    // DELETE NOTIFICATION
    // =================================================

    deleteNotification: builder.mutation<
      any,
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Notification'],
    }),

  }),
});

// =====================================================
// HOOKS
// =====================================================

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationSlice;
