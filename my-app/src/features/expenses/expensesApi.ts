import { api } from '../../app/api';
import type { ExpenseItem } from './types';

export interface ExpensesQuery {
  month?: number;
  year?: number;
  category?: string;
}

export interface CreateExpenseRequest {
  description: string;
  category: string;
  amount: number;
  date: string;
}

export const expensesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ExpenseItem[], ExpensesQuery | void>({
      query: (query) => {
        const params: Record<string, string | number> = {};
        if (query?.month) params.month = query.month;
        if (query?.year) params.year = query.year;
        if (query?.category) params.category = query.category;
        return { url: '/expenses', params };
      },
      providesTags: ['Expenses'],
    }),
    addExpense: builder.mutation<ExpenseItem, CreateExpenseRequest>({
      query: (body) => ({
        url: '/expenses',
        method: 'POST',
        body,
      }),
      // Баланс і статистика рахуються на бекенді з тих самих записів,
      // тому нова витрата має "протухати" й їхній кеш теж.
      invalidatesTags: ['Expenses', 'Balance', 'Statistics'],
    }),
    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses', 'Balance', 'Statistics'],
    }),
  }),
});

export const { useGetExpensesQuery, useAddExpenseMutation, useDeleteExpenseMutation } = expensesApi;
