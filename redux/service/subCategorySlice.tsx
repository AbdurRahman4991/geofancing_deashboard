import { api } from '../api/baseApi';

export interface SubCategoryParent {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  company_id: number;
  category_id: number;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  category: SubCategoryParent | null;
}

export interface SubCategoryPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface SubCategoryPage {
  current_page: number;
  data: SubCategory[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: SubCategoryPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface SubCategoriesResponse {
  status: number;
  data: SubCategoryPage;
}

export interface GetSubCategoriesParams {
  company_id: number | string;
  page?: number;
  per_page?: number;
}

export interface GetSingleSubCategoryParams {
  id: number;
  company_id: number;
}

export interface SubCategoryRequest {
  company_id: number;
  category_id: number;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
}

function unwrapSubCategory(response: { data?: SubCategory } | SubCategory): SubCategory {
  return 'data' in response && response.data ? response.data : (response as SubCategory);
}

export const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query<SubCategoriesResponse, GetSubCategoriesParams>({
      query: ({ company_id, page = 1, per_page = 10 }) => ({
        url: 'sub-categories',
        params: { company_id, page, per_page },
      }),
      providesTags: ['subcategories'],
    }),
    getSingleSubCategory: builder.query<SubCategory, GetSingleSubCategoryParams>({
      query: ({ id, company_id }) => ({
        url: `sub-categories/${id}`,
        params: { company_id },
      }),
      transformResponse: unwrapSubCategory,
      providesTags: (_result, _error, { id }) => [{ type: 'subcategories', id }],
    }),
    createSubCategory: builder.mutation<SubCategory, SubCategoryRequest>({
      query: (body) => ({
        url: 'sub-categories',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      transformResponse: unwrapSubCategory,
      invalidatesTags: ['subcategories'],
    }),
    updateSubCategory: builder.mutation<SubCategory, { id: number; data: SubCategoryRequest }>({
      query: ({ id, data }) => ({
        url: `sub-categories/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      transformResponse: unwrapSubCategory,
      invalidatesTags: (_result, _error, { id }) => ['subcategories', { type: 'subcategories', id }],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSingleSubCategoryQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = subCategorySlice;