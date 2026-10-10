
import { api } from '../api/baseApi';

// =====================================================
// COMPANY
// =====================================================

export interface Company {
  id: number;
  company_name: string;
  avatar_url: string;
  media: any[];
}

// =====================================================
// USER
// =====================================================

export interface AttendanceUser {
  id: number;
  name?: string;
  email?: string;
  employee?: {
    id: number;
    employee_id?: string;
    name?: string;
  };
}

// =====================================================
// ATTENDANCE ROLE
// =====================================================

export interface AttendanceRole {
  id: number;
  user_id: number | null;
  company_id: number;

  office_in_time: string;
  office_out_time: string;

  weekend_holidays: string | string[];
  government_holidays: string | string[];

  is_active: boolean;
  tracking_enabled: boolean;

  created_at: string;
  updated_at: string;

  company: Company | null;
  user: AttendanceUser | null;
}

// =====================================================
// PAGINATION LINK
// =====================================================

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

// =====================================================
// PAGINATED RESPONSE
// =====================================================

export interface AttendanceRolePagination {
  current_page: number;

  data: AttendanceRole[];

  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;

  links: PaginationLink[];

  next_page_url: string | null;

  path: string;

  per_page: number;

  prev_page_url: string | null;

  to: number | null;

  total: number;
}

// =====================================================
// QUERY PARAMS
// =====================================================

export interface AttendanceRoleQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  company_id?: number | string;
  user_id?: number | string;
  is_active?: number | boolean;
}

// =====================================================
// CREATE DATA
// =====================================================

export interface CreateAttendanceRoleRequest {
  user_id?: number | null;
  company_id: number;

  office_in_time: string;
  office_out_time: string;

  weekend_holidays: string | string[];
  government_holidays: string | string[];

  is_active?: boolean;
  tracking_enabled?: boolean;
}

// =====================================================
// UPDATE DATA
// =====================================================

export interface UpdateAttendanceRoleRequest {
  user_id?: number | null;
  company_id?: number;

  office_in_time?: string;
  office_out_time?: string;

  weekend_holidays?: string | string[];
  government_holidays?: string | string[];

  is_active?: boolean;
  tracking_enabled?: boolean;
}

// =====================================================
// API
// =====================================================

export const attendanceRoleSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // =================================================
    // GET ALL ATTENDANCE ROLES
    // =================================================

    getAttendanceRoles: builder.query<
      AttendanceRolePagination,
      AttendanceRoleQueryParams
    >({
      query: (params) => ({
        url: '/attendance-rules',
        method: 'GET',
        params,
      }),

      providesTags: ['AttendanceRole'],
    }),

    // =================================================
    // GET SINGLE ATTENDANCE ROLE
    // =================================================

    getSingleAttendanceRole: builder.query<
      AttendanceRole,
      number | string
    >({
      query: (id) => ({
        url: `/attendance-rules/${id}`,
        method: 'GET',
      }),

      providesTags: (_result, _error, id) => [
        {
          type: 'AttendanceRole',
          id,
        },
      ],
    }),

    // =================================================
    // CREATE ATTENDANCE ROLE
    // =================================================

    createAttendanceRole: builder.mutation<
      AttendanceRole,
      CreateAttendanceRoleRequest
    >({
      query: (data) => ({
        url: '/attendance-rules',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['AttendanceRole'],
    }),

    // =================================================
    // UPDATE ATTENDANCE ROLE
    // =================================================

    updateAttendanceRole: builder.mutation<
      AttendanceRole,
      {
        id: number | string;
        data: UpdateAttendanceRoleRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/attendance-rules/${id}`,
        method: 'PUT',
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        'AttendanceRole',
        {
          type: 'AttendanceRole',
          id,
        },
      ],
    }),

    // =================================================
    // DELETE ATTENDANCE ROLE
    // =================================================

    deleteAttendanceRole: builder.mutation<
      any,
      number | string
    >({
      query: (id) => ({
        url: `/attendance-rules/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['AttendanceRole'],
    }),

    // =================================================
    // TOGGLE STATUS
    // =================================================

    toggleAttendanceRoleStatus: builder.mutation<
      AttendanceRole,
      {
        id: number | string;
        is_active: boolean;
      }
    >({
      query: ({ id, is_active }) => ({
        url: `/attendance-rules/${id}`,
        method: 'PUT',
        body: {
          is_active,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        'AttendanceRole',
        {
          type: 'AttendanceRole',
          id,
        },
      ],
    }),
  }),
});

// =====================================================
// HOOKS
// =====================================================

export const {
  useGetAttendanceRolesQuery,
  useGetSingleAttendanceRoleQuery,
  useCreateAttendanceRoleMutation,
  useUpdateAttendanceRoleMutation,
  useDeleteAttendanceRoleMutation,
  useToggleAttendanceRoleStatusMutation,
} = attendanceRoleSlice;
