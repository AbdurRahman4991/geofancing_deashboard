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

export interface AreaResponse {
  status: number;
  data: Area[];
}

export const areaSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all areas
    getAreas: builder.query<AreaResponse, void>({
      query: () => ({
        url: "areas",
        method: "GET",
      }),

      transformResponse: (response: any): AreaResponse => ({
        status: response.status,
        data: response.data,
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