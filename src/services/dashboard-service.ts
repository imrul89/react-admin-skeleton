import { DashboardStats, DashboardStatsQuery } from '@models/dashboard-model';
import baseService from '@services/core/base-service';
import { API_END_POINTS } from '@utils/constants/api-end-points';
import { formatQueryParams } from '@utils/helpers';

export const dashboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    dashboardStats: builder.query<DashboardStats, DashboardStatsQuery>({
      query: (queryParams) => ({
        url: API_END_POINTS.dashboard + `/stats?${formatQueryParams(queryParams)}`,
        method: 'GET'
      }),
      providesTags: ['dashboard']
    })
  })
});

export const {
  useDashboardStatsQuery
} = dashboardService;

