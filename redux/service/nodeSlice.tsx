import { api } from '../api/baseApi';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type NodeStatus = 'active' | 'inactive';

export interface HierarchyNodeReference {
  id: number;
  name: string;
  level_order?: number;
}

export interface HierarchyNode {
  id: number;
  company_id: number;
  hierarchy_level_id: number;
  parent_id: number | null;
  name: string;
  code: string | null;
  status: NodeStatus;
  created_at?: string;
  updated_at?: string;
  children_count?: number;
  level?: HierarchyNodeReference | null;
  parent?: HierarchyNodeReference | null;
}

export interface NodePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface NodeResponse {
  status: number;
  data: NodePagination & {
    data: HierarchyNode[];
  };
}

export interface NodeQueryParams {
  company_id: number;
  page?: number;
  per_page?: number;
  hierarchy_level_id?: number;
  parent_id?: number | null;
  search?: string;
  status?: NodeStatus;
}

export interface NodeRequest {
  company_id: number;
  hierarchy_level_id: number;
  parent_id: number | null;
  name: string;
  code?: string | null;
  status: NodeStatus;
}

export interface SingleNodeQueryParams {
  id: number;
  company_id: number;
}

// ----------------------------------------------------------------------
// API
// ----------------------------------------------------------------------

export const nodeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNodes: builder.query<NodeResponse, NodeQueryParams>({
      query: ({ company_id, page, per_page, hierarchy_level_id, parent_id, search, status }) => ({
        url: 'hierarchy-nodes',
        method: 'GET',
        params: {
          company_id,
          page,
          per_page,
          hierarchy_level_id,
          parent_id,
          search,
          status,
        },
      }),
      transformResponse: (response: any): NodeResponse => {
        // Accept both a plain Laravel paginator and an extra `{ data: ... }` envelope.
        const pageData = response?.data?.data?.data
          ? response.data.data
          : response?.data ?? response;
        const rows = Array.isArray(pageData)
          ? pageData
          : Array.isArray(pageData?.data)
            ? pageData.data
            : [];

        return {
          status: response?.status ?? 200,
          data: {
            current_page: pageData?.current_page ?? 1,
            last_page: pageData?.last_page ?? 1,
            per_page: pageData?.per_page ?? rows.length,
            total: pageData?.total ?? rows.length,
            from: pageData?.from ?? (rows.length ? 1 : null),
            to: pageData?.to ?? (rows.length ? rows.length : null),
            data: rows,
          },
        };
      },
      providesTags: ['hierarchyNodes'],
    }),
    getSingleNode: builder.query<HierarchyNode, SingleNodeQueryParams>({
      query: ({ id, company_id }) => ({
        url: `hierarchy-nodes/${id}`,
        method: 'GET',
        params: { company_id },
      }),
      transformResponse: (response: any): HierarchyNode => response.data ?? response,
      providesTags: ['hierarchyNodes'],
    }),

    createNode: builder.mutation<HierarchyNode, NodeRequest>({
      query: (body) => ({
        url: 'hierarchy-nodes',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any): HierarchyNode => response.data ?? response,
      invalidatesTags: ['hierarchyNodes'],
    }),

    updateNode: builder.mutation<
      HierarchyNode,
      { id: number; data: NodeRequest }
    >({
      query: ({ id, data }) => ({
        url: `hierarchy-nodes/${id}`,
        method: 'PUT',
        params: { company_id: data.company_id },
        body: data,
      }),
      transformResponse: (response: any): HierarchyNode => response.data ?? response,
      invalidatesTags: ['hierarchyNodes'],
    }),

    deleteNode: builder.mutation<void, { id: number; company_id: number }>({
      query: ({ id, company_id }) => ({
        url: `hierarchy-nodes/${id}`,
        method: 'DELETE',
        params: { company_id },
      }),
      invalidatesTags: ['hierarchyNodes'],
    }),

  }),
});

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

export const {
  useGetNodesQuery,
  useGetSingleNodeQuery,
  useCreateNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
} = nodeSlice;
