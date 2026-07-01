import { api } from "../api/baseApi";
interface Attendance {
  id: number;
  user_id: number;
  check_in_time?: string;
  check_out_time?: string;
  work_hour?: string;
  late?: string;
  status: string;
  created_at: string;
}

interface AttendanceHistoryParams {
  page?: number;
  year?: number;
  month?: string;
  late?: "yes";
  status?: string;
}


export const attendanceSlice = api.injectEndpoints({
  endpoints: (builder) => ({

    // ============================
    // Attendance History
    // ============================
    getAttendanceHistory: builder.query<
      {
        data: Attendance[];
        pagination: any;
      },
      AttendanceHistoryParams
    >({
      query: ({
        page = 1,
        year,
        month,
        late,
        status,
      }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        if (year) params.append("year", year.toString());
        if (month) params.append("month", month);
        if (late) params.append("late", late);
        if (status) params.append("status", status);

        return `attendance-history?${params.toString()}`;
      },

      transformResponse: (response: any) => ({
        data: response.data.data,
        pagination: {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page,
        },
      }),

      providesTags: ["attendance"],
    }),
  }),
});

export const {
  useGetAttendanceHistoryQuery,
} = attendanceSlice;
