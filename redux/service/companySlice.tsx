// import { api } from '../api/baseApi'

// export const companySlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getCompany: builder.query({
//       query: ({token,page,limit}) => `company?page=${page}&limit=${limit}`,
//       providesTags : ["company"]
//     }),
    
   
//     getDepartment: builder.query({
//       query: (token) => `department`,
//       providesTags : ["department"]
//     }),

//     getAcivment: builder.query({
//       query: (token) => `achievement`,
//       providesTags : ["achievement"]
//     }),

 

//     deleteEmplyee: builder.mutation({
//       query: id => ({
//         url: `employees/${id}`,
//         method: 'DELETE',  
//         headers:{
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       }),
//       invalidatesTags: ['employees']
//     }),
    
//     createEmplyee: builder.mutation({
//       query: data => ({
//         url: 'employees',
//         method: 'POST',
//         headers:{
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: data
//       }),
//       invalidatesTags: ['employees']
//     }),

//     updateEmplyee: builder.mutation({
//       query: data => ({
      
//         url: `employees/${data.id}`,
//         method: 'PUT',
//         headers:{
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: data
//       }),
//       invalidatesTags: ['employees']
//     })
//   }),
// })

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
// export const { useGetEmplyeeQuery, useCreateEmplyeeMutation , useGetAcivmentQuery, useGetDepartmentQuery, useDeleteEmplyeeMutation, useUpdateEmplyeeMutation
// } = emplyeSlice

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
    // getCompany: builder.query<Company[], { page?: number; limit?: number }>({
    //   query: ({ page = 1, limit = 10 }) => `companies?page=${page}&limit=${limit}`,
    //   transformResponse: (response: any) => response.data.data,
    //   providesTags: ['company'],
    // }),
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

    createCompany: builder.mutation<Company, CompanyRequest>({
      query: (data) => ({
        url: 'companies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['company'],
    }),

    updateCompany: builder.mutation<Company, CompanyRequest>({
      query: (data) => ({
        url: `companies/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['company'],
    }),
  }),
})

export const { 
  useGetCompanyQuery, 
  useDeleteCompanyMutation,
  useCreateCompanyMutation,
  useUpdateCompanyMutation 
} = companySlice
