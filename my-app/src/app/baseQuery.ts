import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../features/auth/authSlice';
import type { AuthResponse } from '../features/auth/types';
import type { RootState } from './store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return headers;
  },
});

// No automatic Authorization header — POST /auth/refresh needs the
// refresh token attached manually, never the (expired/invalid) access
// token rawBaseQuery would inject via prepareHeaders.
const refreshBaseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });

// Only one refresh request in flight at a time. Several queries can hit
// 401 at once (e.g. a page firing 3 RTK Query hooks on mount) — without
// this they'd each call /auth/refresh, and since the backend rotates the
// refresh token on every use, only the first would succeed and the rest
// would log the user out by racing each other.
let refreshPromise: Promise<boolean> | null = null;

const requestUrl = (args: string | FetchArgs): string => (typeof args === 'string' ? args : args.url);

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = requestUrl(args);
  const isAuthEndpoint =
    url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register');

  if (result.error?.status === 401 && !isAuthEndpoint) {
    refreshPromise ??= (async () => {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;
      if (!refreshToken) return false;

      const refreshResult = await refreshBaseQuery(
        { url: '/auth/refresh', method: 'POST', headers: { Authorization: `Bearer ${refreshToken}` } },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data as AuthResponse));
        return true;
      }
      return false;
    })().finally(() => {
      refreshPromise = null;
    });

    const refreshed = await refreshPromise;

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
