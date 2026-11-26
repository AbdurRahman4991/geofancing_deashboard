import { api } from '../api/baseApi';

export type TourPlanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TourPlanStop {
  id?: number;
  geofence_id: number;
  sequence?: number;
  planned_arrival_time: string | null;
  notes?: string | null;
  geofence?: { id: number; firm_name: string; address: string | null };
}

export interface TourPlan {
  id: number;
  company_id: number;
  user_id: number;
  plan_date: string;
  status: TourPlanStatus;
  notes: string | null;
  employee?: { id: number; name: string; email: string };
  creator?: { id: number; name: string };
  reviewer?: { id: number; name: string } | null;
  stops: TourPlanStop[];
  created_at?: string;
}

export interface TourPlanPage {
  current_page: number;
  data: TourPlan[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface TourPlanListParams {
  page?: number;
  per_page?: number;
  company_id?: number | string;
  user_id?: number;
  status?: TourPlanStatus;
  from_date?: string;
  to_date?: string;
}

export interface CreateTourPlanRequest {
  company_id?: number;
  user_id?: number;
  plan_date: string;
  notes?: string | null;
  stops: Array<{ geofence_id: number; planned_arrival_time?: string | null; notes?: string | null }>;
}

export type UpdateTourPlanRequest = Pick<CreateTourPlanRequest, 'plan_date' | 'notes' | 'stops'>;

export const tourPlanService = api.injectEndpoints({
  endpoints: (builder) => ({
    getTourPlans: builder.query<TourPlanPage, TourPlanListParams>({
      query: (params) => ({ url: 'tour-plans', params }),
      transformResponse: (response: TourPlanPage | { data: TourPlanPage }) =>
        'data' in response && !Array.isArray(response.data) ? response.data : response as TourPlanPage,
      providesTags: ['tourPlans'],
    }),
    getTourPlan: builder.query<TourPlan, number>({
      query: (id) => ({ url: `tour-plans/${id}` }),
      transformResponse: (response: TourPlan | { data: TourPlan }) =>
        'data' in response ? response.data : response,
      providesTags: ['tourPlans'],
    }),
    createTourPlan: builder.mutation<{ message: string; data: TourPlan }, CreateTourPlanRequest>({
      query: (body) => ({ url: 'tour-plans', method: 'POST', body }),
      invalidatesTags: ['tourPlans'],
    }),
    updateTourPlan: builder.mutation<{ message?: string; data?: TourPlan }, { id: number; body: UpdateTourPlanRequest }>({
      query: ({ id, body }) => ({ url: `tour-plans/${id}`, method: 'PUT', body }),
      invalidatesTags: ['tourPlans'],
    }),
    submitTourPlan: builder.mutation<{ message?: string; data?: TourPlan }, number>({
      query: (id) => ({ url: `tour-plans/${id}/submit`, method: 'POST' }),
      invalidatesTags: ['tourPlans'],
    }),
    approveTourPlan: builder.mutation<{ message?: string; data?: TourPlan }, { id: number; review_note?: string | null }>({
      query: ({ id, ...body }) => ({ url: `tour-plans/${id}/approve`, method: 'POST', body }),
      invalidatesTags: ['tourPlans'],
    }),
    rejectTourPlan: builder.mutation<{ message?: string; data?: TourPlan }, { id: number; review_note: string }>({
      query: ({ id, ...body }) => ({ url: `tour-plans/${id}/reject`, method: 'POST', body }),
      invalidatesTags: ['tourPlans'],
    }),
    cancelTourPlan: builder.mutation<{ message?: string; data?: TourPlan }, number>({
      query: (id) => ({ url: `tour-plans/${id}/cancel`, method: 'POST' }),
      invalidatesTags: ['tourPlans'],
    }),
  }),
});

export const {
  useGetTourPlansQuery,
  useGetTourPlanQuery,
  useCreateTourPlanMutation,
  useUpdateTourPlanMutation,
  useSubmitTourPlanMutation,
  useApproveTourPlanMutation,
  useRejectTourPlanMutation,
  useCancelTourPlanMutation,
} = tourPlanService;
