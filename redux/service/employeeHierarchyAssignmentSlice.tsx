import { api } from '../api/baseApi';

// ======================================================================
// Employee Hierarchy Assignment Interface
// ======================================================================

// ======================================================================
// Employee Hierarchy Assignment - GET/List Response
// ======================================================================

export interface EmployeeHierarchyAssignment {
  id: number;

  user: string | null;

  country: string | null;
  region: string | null;
  zone: string | null;
  division: string | null;
  district: string | null;
  sub_district: string | null;
  territory: string | null;
  area: string | null;

  effective_from: string | null;
  effective_to: string | null;

  is_current: boolean;

  assigned_by: string | null;

  reason: string | null;
}

// ======================================================================
// Pagination
// ======================================================================

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  from: number | null;
  to: number | null;
}

// ======================================================================
// API Response
// ======================================================================

export interface EmployeeHierarchyAssignmentResponse {
  status: number;

  data:
    | PaginationData & {
        data: EmployeeHierarchyAssignment[];
      }
    | EmployeeHierarchyAssignment[]
    | null;
}

// ======================================================================
// Query Parameters
// ======================================================================

export interface EmployeeHierarchyAssignmentQueryParams {
  page?: number;
  per_page?: number;
  search?: string;

  user_id?: number;

  country_id?: number;
  region_id?: number;
  zone_id?: number;
  division_id?: number;
  district_id?: number;
  sub_district_id?: number;
  territory_id?: number;
  area_id?: number;

  is_current?: boolean;
}

// ======================================================================
// Assign User Request
// ======================================================================

export interface AssignUserRequest {
  user_id: number;

  country_id: number;
  region_id: number;
  zone_id: number;
  division_id: number;
  district_id: number;
  sub_district_id: number;
  territory_id: number;
  area_id: number;

  effective_from: string;

  reason?: string;
}

// ======================================================================
// Assign User Response
// ======================================================================

export interface AssignUserResponse {
  status: number;
  message: string;

  data?: EmployeeHierarchyAssignment;
}

// ======================================================================
// Employee Hierarchy Assignment Slice
// ======================================================================

export const employeeHierarchyAssignmentSlice =
  api.injectEndpoints({
    endpoints: (builder) => ({

      // ================================================================
      // Get Employee Hierarchy Assignments
      // ================================================================

      getEmployeeHierarchyAssignments: builder.query<
        EmployeeHierarchyAssignmentResponse,
        EmployeeHierarchyAssignmentQueryParams | void
      >({
        query: (params) => ({
          url: 'employee-hierarchy-assignments',
          method: 'GET',

          params: {
            page: params?.page,
            per_page: params?.per_page,
            search: params?.search,

            user_id: params?.user_id,

            country_id: params?.country_id,
            region_id: params?.region_id,
            zone_id: params?.zone_id,
            division_id: params?.division_id,
            district_id: params?.district_id,
            sub_district_id: params?.sub_district_id,
            territory_id: params?.territory_id,
            area_id: params?.area_id,

            is_current: params?.is_current,
          },
        }),

        transformResponse: (
          response: any
        ): EmployeeHierarchyAssignmentResponse => ({
          status: response.status,
          data: response.data,
        }),

        providesTags: [
          'employeeHierarchyAssignments',
        ],
      }),

      // ================================================================
      // Get Single Assignment
      // ================================================================

      getSingleEmployeeHierarchyAssignment:
        builder.query<
          EmployeeHierarchyAssignment,
          number
        >({
          query: (id) => ({
            url: `employee-hierarchy-assignments/${id}`,
            method: 'GET',
          }),

          transformResponse: (
            response: any
          ): EmployeeHierarchyAssignment => {
            return response.data ?? response;
          },

          providesTags: [
            'employeeHierarchyAssignments',
          ],
        }),

      // ================================================================
      // Assign User
      // ================================================================

      assignUser: builder.mutation<
        AssignUserResponse,
        AssignUserRequest
      >({
        query: (body) => ({
          url: 'employee-hierarchy-assignments',
          method: 'POST',
          body,
        }),

        transformResponse: (
          response: any
        ): AssignUserResponse => ({
          status: response.status,
          message: response.message,
          data: response.data,
        }),

        invalidatesTags: [
          'employeeHierarchyAssignments',
        ],
      }),

      // ================================================================
      // Update Assignment
      // ================================================================

      updateEmployeeHierarchyAssignment:
        builder.mutation<
          EmployeeHierarchyAssignment,
          {
            id: number;
            data: AssignUserRequest;
          }
        >({
          query: ({ id, data }) => ({
            url: `employee-hierarchy-assignments/${id}`,
            method: 'PUT',
            body: data,
          }),

          transformResponse: (
            response: any
          ): EmployeeHierarchyAssignment => {
            return response.data ?? response;
          },

          invalidatesTags: [
            'employeeHierarchyAssignments',
          ],
        }),

      // ================================================================
      // Delete Assignment
      // ================================================================

      deleteEmployeeHierarchyAssignment:
        builder.mutation<void, number>({
          query: (id) => ({
            url: `employee-hierarchy-assignments/${id}`,
            method: 'DELETE',
          }),

          invalidatesTags: [
            'employeeHierarchyAssignments',
          ],
        }),

    }),
  });

// ======================================================================
// Hooks
// ======================================================================

export const {
  useGetEmployeeHierarchyAssignmentsQuery,

  useGetSingleEmployeeHierarchyAssignmentQuery,

  useAssignUserMutation,

  useUpdateEmployeeHierarchyAssignmentMutation,

  useDeleteEmployeeHierarchyAssignmentMutation,
} = employeeHierarchyAssignmentSlice;