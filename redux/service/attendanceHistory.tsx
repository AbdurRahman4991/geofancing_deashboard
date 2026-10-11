import { api } from "../api/baseApi";

export interface AttendanceUser {
  id: number;
  name: string | null;
  employee_id: number | string | null;
}

export interface AttendanceGeofence {
  id: number;
  firm_name: string;
  image_url: string;
  media: unknown[];
}

export interface Attendance {
  id: number;
  user_id: number;
  check_in_time: string | null;
  check_in_latitude: string | null;
  check_in_longitude: string | null;
  geofence_id: number | null;
  check_out_time: string | null;
  work_hour: string | null;
  late: string | null;
  check_out_latitude: string | null;
  check_out_longitude: string | null;
  status: string;
  distance_from_office: string | number | null;
  device_id: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  user: AttendanceUser | null;
  geofence: AttendanceGeofence | null;
}

export interface AttendanceHistoryResponse {
  data: Attendance[];
  pagination: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
}

export interface AttendanceHistoryParams {
  page?: number;
  per_page?: number;
  search?: string;
  year?: number | string;
  month?: string;
  late?: "yes";
  status?: string;
  user_id?: number | string;
}

interface AttendanceHistoryApiResponse {
  status: number;
  data: {
    current_page: number;
    data: Attendance[];
    total: number;
    per_page: number;
    last_page: number;
  };
}

export const attendanceSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceHistory: builder.query<
      AttendanceHistoryResponse,
      AttendanceHistoryParams
    >({
      query: ({
        page = 1,
        per_page = 20,
        search,
        year,
        month,
        late,
        status,
        user_id,
      }) => ({
        url: "attendance/history",
        method: "GET",
        params: { page, per_page, search, year, month, late, status, user_id },
      }),
      transformResponse: (response: AttendanceHistoryApiResponse) => ({
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

export const { useGetAttendanceHistoryQuery } = attendanceSlice;
