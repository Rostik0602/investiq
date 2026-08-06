import { api } from "../../app/api";
import type {
  BreakdownStat,
  CategoryStat,
  MonthlyStat,
  StatisticsType,
} from "./types";

export const statisticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthly: builder.query<MonthlyStat[], { year: number }>({
      query: ({ year }) => ({ url: "/statistics/monthly", params: { year } }),
      providesTags: ["Statistics"],
    }),
    getCategories: builder.query<
      CategoryStat[],
      { month: number; year: number; type: StatisticsType }
    >({
      query: (params) => ({ url: "/statistics/categories", params }),
      providesTags: ["Statistics"],
    }),
    getBreakdown: builder.query<
      BreakdownStat[],
      { month: number; year: number; type: StatisticsType; category?: string }
    >({
      query: ({ month, year, type, category }) => {
        const params: Record<string, string | number> = { month, year, type };
        if (category) params.category = category;
        return { url: "/statistics/breakdown", params };
      },
      providesTags: ["Statistics"],
    }),
  }),
});

export const {
  useGetMonthlyQuery,
  useGetCategoriesQuery,
  useGetBreakdownQuery,
} = statisticsApi;
