// import { api } from "../api/baseApi";
// export interface Attendance {
//   id: number;
//   user_id: number;

//   check_in_time: string | null;
//   check_out_time: string | null;

//   check_in_latitude: string | null;
//   check_in_longitude: string | null;

//   check_out_latitude: string | null;
//   check_out_longitude: string | null;

//   geofence_id: number;

//   work_hour: string | null;
//   late: string | null;

//   status: string;
//   distance_from_office: number;
//   device_id: string;
//   remarks: string | null;

//   created_at: string;
//   updated_at: string;

//   user?: {
//     id: number;
//     name: string | null;
//     employee_id: string;
//   };
// }

// export interface AttendanceHistoryResponse {
//   data: Attendance[];
//   pagination: {
//     current_page: number;
//     total: number;
//     per_page: number;
//     last_page: number;
//   };
// }

// export interface AttendanceHistoryParams {
//   page?: number;
//   per_page?: number;

//   year?: number;
//   month?: string;

//   late?: "yes";
//   status?: string;

//   user_id?: number;
// }

// // ==============================
// // API
// // ==============================

// export const attendanceSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getAttendanceHistory: builder.query<
//       AttendanceHistoryResponse,
//       AttendanceHistoryParams
//     >({
//       query: ({
//         page = 1,
//         per_page = 20,
//         year,
//         month,
//         late,
//         status,
//         user_id,
//       }) => ({
//         url: "attendance/history",
//         params: {
//           page,
//           per_page,
//           year,
//           month,
//           late,
//           status,
//           user_id,
//         },
//       }),

//       transformResponse: (response: any) => ({
//         data: response.data.data,
//         pagination: {
//           current_page: response.data.current_page,
//           total: response.data.total,
//           per_page: response.data.per_page,
//           last_page: response.data.last_page,
//         },
//       }),

//       providesTags: ["attendance"],
//     }),
//   }),
// });

// export const {
//   useGetAttendanceHistoryQuery,
// } = attendanceSlice;

import { api } from "../api/baseApi";

// ==============================
// Interfaces
// ==============================

export interface Attendance {
  id: number;
  user_id: number;

  check_in_time: string | null;
  check_out_time: string | null;

  check_in_latitude: string | null;
  check_in_longitude: string |null;

  check_out_latitude: string | null;
  check_out_longitude: string | null;

  geofence_id: number | null;

  work_hour: string | null;
  late: string | null;

  status: string;
  distance_from_office: number | null;
  device_id: string | null;
  remarks: string | null;

  created_at: string;
  updated_at: string;

  user?: {
    id: number;
    name: string;
    employee_id: string;
  };
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

// ==============================
// API
// ==============================

export const attendanceSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceHistory: builder.query<
      AttendanceHistoryResponse,
      AttendanceHistoryParams
    >({
      query: ({
        page = 1,
        per_page = 20,
        search = "",
        year = "",
        month = "",
        late = "",
        status = "",
        user_id = "",
      }) => ({
        url: "attendance/history",
        method: "GET",
        params: {
          page,
          per_page,
          search,
          year,
          month,
          late,
          status,
          user_id,
        },
      }),

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

// ==============================
// Hooks
// ==============================

export const {
  useGetAttendanceHistoryQuery,
} = attendanceSlice;