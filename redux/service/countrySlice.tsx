import { api } from '../api/baseApi';

// ==============================
// Interfaces
// ==============================

export interface Country {
  id: number;
  name: string;
  code: string | null;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface CountryResponse {
  status: number;
  data: Country[];
}

// ==============================
// API
// ==============================

export const countrySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================
    // Get Country List
    // ==========================
    getCountries: builder.query<CountryResponse, void>({
      query: () => ({
        url: 'countries',
        method: 'GET',
      }),

      transformResponse: (response: any): CountryResponse => ({
        status: response.status,
        data: response.data ?? [],
      }),

      providesTags: ['countries'],
    }),

    // ==========================
    // Get Single Country
    // ==========================
    getSingleCountry: builder.query<Country, number>({
      query: (id) => `countries/${id}`,

      transformResponse: (response: any): Country => {
        return response.data ?? response;
      },

      providesTags: ['countries'],
    }),

    // ==========================
    // Create Country
    // ==========================
    createCountry: builder.mutation<
      Country,
      {
        name: string;
        code: string | null;
        status: number;
      }
    >({
      query: (body) => ({
        url: 'countries',
        method: 'POST',
        body,
      }),

      transformResponse: (response: any): Country => {
        return response.data ?? response;
      },

      invalidatesTags: ['countries'],
    }),

    // ==========================
    // Update Country
    // ==========================
    updateCountry: builder.mutation<
      Country,
      {
        id: number;
        data: {
          name: string;
          code: string | null;
          status: number;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `countries/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: any): Country => {
        return response.data ?? response;
      },

      invalidatesTags: ['countries'],
    }),

    // ==========================
    // Delete Country
    // ==========================
    deleteCountry: builder.mutation<void, number>({
      query: (id) => ({
        url: `countries/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['countries'],
    }),
  }),
});

// ==============================
// Hooks
// ==============================

export const {
  useGetCountriesQuery,
  useGetSingleCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countrySlice;