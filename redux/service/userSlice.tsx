import { api } from "../api/baseApi";

export interface UserRecord {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  employee_id: number | null;
  company_id: number | string | null;
  status: string;
  created_at: string;
  employee?: {
    id: number;
    name: string;
    employee_id: string;
    company_id: number | string | null;
    designation: string | null;
  } | null;
}

export interface CreateUserRequest {
  employee_id: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateUserRequest {
  email: string;
  password?: string;
  password_confirmation?: string;
}
export interface CreateUserResponse {
  message: string;
  user: UserRecord;
}
export interface UserListResponse {
  data: UserRecord[];
  current_page: number;
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  per_page: number;
  to: number | null;
  total: number;
}

export interface AssignedRoleUser {
  id: number;
  employee_id: number;
  name: string;
  employee?: {
    id: number;
    employee_id: string;
    name: string;
  } | null;
  roles: Array<{ id: number; name: string }>;
}

export interface AssignRoleUsersResponse {
  data: {
    data: AssignedRoleUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // User list for Role Assign
    getAssignRoleUsers: builder.query<AssignRoleUsersResponse, {
      page?: number;
      per_page?: number;
      search?: string;
    }>({
      query: ({
        page = 1,
        per_page = 10,
        search = "",
      }) => ({
        url: "assign-role/users",
        params: {
          page,
          per_page,
          search,
        },
      }),
      providesTags: ["users"],
    }),

    getUsers: builder.query<UserListResponse, {
      page?: number;
      per_page?: number;
      search?: string;
    }>({
      query: ({ page = 1, per_page = 10, search } = {}) => {
        const normalizedSearch = search?.trim();

        return {
          url: "/users",
          method: "GET",
          params: {
            page,
            per_page,
            ...(normalizedSearch ? { search: normalizedSearch } : {}),
          },
        };
      },
      transformResponse: (response: any): UserListResponse => {
        // Support both a raw Laravel paginator and an API `{ data: paginator }` envelope.
        if (response?.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) {
          return response.data;
        }

        return response;
      },
      providesTags: ["users"],
    }),

    getSingleUser: builder.query<UserRecord, number | string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: UserRecord }) => response.data,
      providesTags: ["users"],
    }),

    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
    updateUser: builder.mutation<unknown, { id: number | string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetAssignRoleUsersQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userSlice;

