// redux/service/userSlice.ts

import { api } from "../api/baseApi";

export const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // User list for Role Assign
    getAssignRoleUsers: builder.query({
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

  }),
});

export const {
  useGetAssignRoleUsersQuery,
} = userSlice;