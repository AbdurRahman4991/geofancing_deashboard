import { api } from '../api/baseApi';

export interface CategorySubcategory {
  id: number;
  company_id: number;
  category_id: number;
  name: string;
  status: string;
}

export interface Category {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  subcategories: CategorySubcategory[];
}

export interface CategoryPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface CategoryPage {
  current_page: number;
  data: Category[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: CategoryPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface CategoriesResponse {
  status: number;
  data: CategoryPage;
}

export interface GetCategoriesParams {
  company_id: number | string;
  page?: number;
  per_page?: number;
}

export interface GetSingleCategoryParams {
  id: number;
  company_id: number;
}

export interface CategoryRequest {
  company_id: number;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
}

function unwrapCategory(response: { data?: Category } | Category): Category {
  return 'data' in response && response.data ? response.data : (response as Category);
}

export const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, GetCategoriesParams>({
      query: ({ company_id, page = 1, per_page = 10 }) => ({
        url: 'categories',
        params: { company_id, page, per_page },
      }),
      providesTags: ['categories'],
    }),
    getSingleCategory: builder.query<Category, GetSingleCategoryParams>({
      query: ({ id, company_id }) => ({
        url: `categories/${id}`,
        params: { company_id },
      }),
      transformResponse: unwrapCategory,
      providesTags: (_result, _error, { id }) => [{ type: 'categories', id }],
    }),
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({
        url: 'categories',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      transformResponse: unwrapCategory,
      invalidatesTags: ['categories'],
    }),
    updateCategory: builder.mutation<Category, { id: number; data: CategoryRequest }>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      transformResponse: unwrapCategory,
      invalidatesTags: (_result, _error, { id }) => ['categories', { type: 'categories', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categorySlice;
