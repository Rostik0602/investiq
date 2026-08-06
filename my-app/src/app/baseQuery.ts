import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/auth/authSlice";
import type { AuthResponse } from "../features/auth/types";
import type { RootState } from "./store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const refreshBaseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });

let refreshPromise: Promise<boolean> | null = null;

const requestUrl = (args: string | FetchArgs): string =>
  typeof args === "string" ? args : args.url;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = requestUrl(args);
  const isAuthEndpoint =
    url.includes("/auth/refresh") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register");

  if (result.error?.status === 401 && !isAuthEndpoint) {
    refreshPromise ??= (async () => {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;
      if (!refreshToken) return false;

      const refreshResult = await refreshBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          headers: { Authorization: `Bearer ${refreshToken}` },
        },
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
