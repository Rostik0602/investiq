import { api } from "../../app/api";
import type { BalanceResponse } from "./types";

export const balanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query<BalanceResponse, void>({
      query: () => "/balance",
      providesTags: ["Balance"],
    }),
    setBalance: builder.mutation<BalanceResponse, { startingBalance: number }>({
      query: (body) => ({
        url: "/balance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Balance"],
    }),
  }),
});

export const { useGetBalanceQuery, useSetBalanceMutation } = balanceApi;
