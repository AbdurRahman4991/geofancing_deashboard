import { api } from "../api/baseApi";

export interface Territory {
  id: number;
  sub_district_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface Area {
  id: number;
  territory_id: number;
  name: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  territory?: Territory;
}

// Pagination response
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface AreaResponse {
  status: number;
  data: Area[];
  meta: PaginationMeta;
}

// Get areas query parameters
export interface GetAreasParams {
  territory_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export const areaSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get areas with search, territory filter and pagination
    getAreas: builder.query<AreaResponse, GetAreasParams>({
      query: ({
        territory_id,
        search,
        page = 1,
        per_page = 10,
      }) => ({
        url: "areas",
        method: "GET",
        params: {
          territory_id,
          search,
          page,
          per_page,
        },
      }),

      transformResponse: (response: any): AreaResponse => ({
        status: response.status,
        data: response.data?.data ?? [],
        meta: {
          current_page: response.data?.current_page ?? 1,
          last_page: response.data?.last_page ?? 1,
          per_page: response.data?.per_page ?? 10,
          total: response.data?.total ?? 0,
          from: response.data?.from ?? null,
          to: response.data?.to ?? null,
        },
      }),

      providesTags: ["areas"],
    }),

    // Get single area
    getSingleArea: builder.query<Area, number>({
      query: (id) => ({
        url: `areas/${id}`,
        method: "GET",
      }),

      transformResponse: (response: any): Area =>
        response.data ?? response,

      providesTags: ["areas"],
    }),

    // Create area
    createArea: builder.mutation<
      Area,
      {
        territory_id: number;
        name: string;
        status: number;
      }
    >({
      query: (body) => ({
        url: "areas",
        method: "POST",
        body,
      }),

      transformResponse: (response: any): Area =>
        response.data ?? response,

      invalidatesTags: ["areas"],
    }),

    // Update area
    updateArea: builder.mutation<
      Area,
      {
        id: number;
        data: {
          territory_id: number;
          name: string;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `areas/${id}`,
        method: "PUT",
        body: data,
      }),

      transformResponse: (response: any): Area =>
        response.data ?? response,

      invalidatesTags: ["areas"],
    }),

    // Delete area
    deleteArea: builder.mutation<void, number>({
      query: (id) => ({
        url: `areas/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["areas"],
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetSingleAreaQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
} = areaSlice;