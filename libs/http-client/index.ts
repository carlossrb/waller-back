import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

type Config = AxiosRequestConfig & {
  type: 'waller-back' | 'external';
  mockResponse?: (config: AxiosRequestConfig) => Record<string, any> | void;
};

export const createHttpClient = (baseConfig: Config) => {
  const http = axios.create({
    ...baseConfig,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  });

  const request = <T>(config: AxiosRequestConfig): Promise<T> => {
    const mockedResponse = baseConfig.mockResponse && baseConfig.mockResponse(config);
    if (mockedResponse) {
      return Promise.resolve(mockedResponse) as Promise<T>;
    }

    return http
      .request<T>(config)
      .then((res) => res.data)
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new NotFoundException(err.response.data);
        }
        if (err?.response?.status === 400) {
          if (Array.isArray(err.response.data?.message)) {
            throw new BadRequestException(err.response.data.message.join(', '));
          }

          throw new BadRequestException(err.response.data);
        }
        throw err;
      });
  };

  return {
    get: <T>(url: string, params?: any) => {
      return request<T>({
        method: 'get',
        url,
        params,
      });
    },
    post: <T>(url: string, data?: any) => {
      return request<T>({
        method: 'post',
        url,
        data,
      });
    },
    put: <T>(url: string, data?: any) => {
      return request<T>({
        method: 'put',
        url,
        data,
      });
    },
    patch: <T>(url: string, data?: any) => {
      return request<T>({
        method: 'patch',
        url,
        data,
      });
    },
    delete: <T>(url: string, data?: any) => {
      return request<T>({
        method: 'delete',
        url,
        data,
      });
    },
  };
};
