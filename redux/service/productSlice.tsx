import { api } from '../api/baseApi';

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBrand {
  id: number;
  name: string;
}

export interface ProductUnit {
  id: number;
  unit_name: string;
  short_name: string;
}

export interface ProductSubCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  product_name: string;
  category_id: number | string;
  brand_id: number | string;
  unit_id: number | string;
  company_id: number;
  created_at: string;
  updated_at: string;
  category: ProductCategory | null;
  sub_category: ProductSubCategory | null;
  brand: ProductBrand | null;
  unit: ProductUnit | null;
}

export interface CreateProductRequest {
  product_name: string;
  category_id: number;
  brand_id: number;
  unit_id: number;
  company_id: number;
}

export interface ProductMutationResponse {
  message: string;
  data: Product;
}

export const productSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductMutationResponse, CreateProductRequest>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        params: { company_id: body.company_id },
        body,
      }),
      invalidatesTags: ['products'],
    }),
  }),
});

export const { useCreateProductMutation } = productSlice;