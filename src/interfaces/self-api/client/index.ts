import axios from "axios";

export const fetch = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const setAuthorizationHeader = (token: string) => {
  fetch.defaults.headers["Authorization"] = `Bearer ${token}`;
};

export const removeAuthorizationHeader = () => {
  delete fetch.defaults.headers["Authorization"];
};

export const setErrorInterceptors = (
  statusFunctions: Record<string, (_error?: any) => Promise<void>>
) => {
  fetch.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status) {
        error?.response?.status === 401 && removeAuthorizationHeader();
        await statusFunctions?.[error.response.status]?.(error);
      }

      return Promise.reject(error);
    }
  );

  return () => fetch.interceptors.response.clear();
};
