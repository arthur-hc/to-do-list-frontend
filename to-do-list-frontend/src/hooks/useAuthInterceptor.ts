import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { api, removeToken } from '../services/api';

export const useAuthInterceptor = () => {
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          const isAuthEndpoint = error.config?.url?.includes('/authenticate');
          const isUnauthorizedStatus = error.response?.status === 401;

          if (isUnauthorizedStatus && !isAuthEndpoint) {
            removeToken();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount component
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);
};
