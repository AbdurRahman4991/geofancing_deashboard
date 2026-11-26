import { api } from '../api/baseApi';

export interface CountryHiearchyNode {
  id: number;
  company_id: number;
  hierarchy_level_id: number;
  parent_id: number | null;
  name: string;
  code: string | null;
  status: 'active' | 'inactive';
  latitude: number | null;
  longitude: number | null;
  level?: { id: number; name: string; level_order?: number };
  parent?: { id: number; name: string; hierarchy_level_id?: number } | null;
  created_at?: string;
  updated_at?: string;
}

export interface CountryHiearchyNodePage {
  current_page: number;
  data: CountryHiearchyNode[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CountryHiearchyNodeListParams {
  company_id: number;
  page?: number;
  per_page?: number;
  hierarchy_level_id?: number;
  parent_id?: number | null | '';
  status?: CountryHiearchyNode['status'];
  search?: string;
}

export interface CountryHiearchyNodeData {
  hierarchy_level_id: number;
  parent_id?: number | null;
  name: string;
  code?: string | null;
  status?: CountryHiearchyNode['status'];
  latitude?: number | null;
  longitude?: number | null;
}

type LaravelNodePageResponse = CountryHiearchyNodePage | { data: CountryHiearchyNodePage };
type LaravelNodeResponse = CountryHiearchyNode | { data: CountryHiearchyNode };

function unwrapPage(response: LaravelNodePageResponse): CountryHiearchyNodePage {
  return 'current_page' in response ? response : response.data;
}

function unwrapNode(response: LaravelNodeResponse): CountryHiearchyNode {
  return 'id' in response ? response : response.data;
}

export const countryHiearchyNodeService = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountryHiearchyNodes: builder.query<CountryHiearchyNodePage, CountryHiearchyNodeListParams>({
      query: ({ company_id, page = 1, per_page = 15, ...filters }) => ({
        url: 'country-hierarchy-nodes',
        params: { company_id, page, per_page, ...filters },
      }),
      transformResponse: unwrapPage,
      providesTags: ['countryHierarchyNodes'],
    }),
    getCountryHiearchyNode: builder.query<CountryHiearchyNode, { company_id: number; id: number }>({
      query: ({ company_id, id }) => ({ url: `country-hierarchy-nodes/${id}`, params: { company_id } }),
      transformResponse: unwrapNode,
      providesTags: ['countryHierarchyNodes'],
    }),
    createCountryHiearchyNode: builder.mutation<CountryHiearchyNode, { company_id: number; data: CountryHiearchyNodeData }>({
      query: ({ company_id, data }) => ({ url: 'country-hierarchy-nodes', method: 'POST', params: { company_id }, body: data }),
      transformResponse: unwrapNode,
      invalidatesTags: ['countryHierarchyNodes'],
    }),
    updateCountryHiearchyNode: builder.mutation<CountryHiearchyNode, { company_id: number; id: number; data: Partial<CountryHiearchyNodeData> }>({
      query: ({ company_id, id, data }) => ({ url: `country-hierarchy-nodes/${id}`, method: 'PUT', params: { company_id }, body: data }),
      transformResponse: unwrapNode,
      invalidatesTags: ['countryHierarchyNodes'],
    }),
    deleteCountryHiearchyNode: builder.mutation<void, { company_id: number; id: number }>({
      query: ({ company_id, id }) => ({ url: `country-hierarchy-nodes/${id}`, method: 'DELETE', params: { company_id } }),
      invalidatesTags: ['countryHierarchyNodes'],
    }),
  }),
});

export const {
  useGetCountryHiearchyNodesQuery,
  useGetCountryHiearchyNodeQuery,
  useCreateCountryHiearchyNodeMutation,
  useUpdateCountryHiearchyNodeMutation,
  useDeleteCountryHiearchyNodeMutation,
} = countryHiearchyNodeService;
