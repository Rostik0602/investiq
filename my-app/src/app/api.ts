import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// Single RTK Query instance shared by every feature (auth/expenses/income/
// balance/statistics), each injecting its own endpoints via
// `api.injectEndpoints(...)`. This has to be one instance rather than one
// createApi() per feature: tag invalidation only works WITHIN a single
// createApi's cache — an expense mutation invalidating the 'Balance' tag
// only refetches balance data if balance's endpoints live on this same
// instance.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Expenses', 'Income', 'Balance', 'Statistics'],
  endpoints: () => ({}),
});
