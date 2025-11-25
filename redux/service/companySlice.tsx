
import { api } from '../api/baseApi'

export interface Company {
  id: number
  company_name: string
  email: string
  phone: string
  address: string
}

export interface CompanyRequest {
  id?: string
  company_name: string
  email: string
  phone: string
  address: string
}

export const companySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query<
  { data: Company[]; pagination: any },
  { page?: number; limit?: number }
  >({
    query: ({ page = 1, limit = 10 }) => `companies?page=${page}&limit=${limit}`,
    transformResponse: (response: any) => ({
      data: response.data.data, // company list
      pagination: {
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      },
    }),
    providesTags: ['company'],
  }),


    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['company'],
    }),

    createCompany: builder.mutation<Company, FormData>({
      query: (formData) => ({
        url: 'companies',
        method: 'POST',
        body: formData, 
      }),
      invalidatesTags: ['company'],
    }),

    getSingleCompany: builder.query<any, string>({
      query: (id) => `companies/${id}`,
      transformResponse: (response: any) => response.data,  
      providesTags: ['company'],
    }),



      updateCompany: builder.mutation({
        query: ({ id, data }) => {
          data.append("_method", "PUT"); 

          return {
            url: `companies/${id}`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: ['company'],
      }),


  }),
})

export const {   
  useGetCompanyQuery, 
  useDeleteCompanyMutation,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetSingleCompanyQuery
} = companySlice;

  

