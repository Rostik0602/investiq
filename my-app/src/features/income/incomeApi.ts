import { api } from "../../app/api";
import type { IncomeItem } from "./types";

export interface IncomeQuery {
  month?: number;
  year?: number;
  category?: string;
}

export interface CreateIncomeRequest {
  description: string;
  category: string;
  amount: number;
  date: string;
}

export const incomeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIncome: builder.query<IncomeItem[], IncomeQuery | void>({
      query: (query) => {
        const params: Record<string, string | number> = {};
        if (query?.month) params.month = query.month;
        if (query?.year) params.year = query.year;
        if (query?.category) params.category = query.category;
        return { url: "/income", params };
      },
      providesTags: ["Income"],
    }),
    addIncome: builder.mutation<IncomeItem, CreateIncomeRequest>({
      query: (body) => ({
        url: "/income",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Income", "Balance", "Statistics"],
    }),
    deleteIncome: builder.mutation<void, string>({
      query: (id) => ({
        url: `/income/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Income", "Balance", "Statistics"],
    }),
  }),
});

export const {
  useGetIncomeQuery,
  useAddIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
