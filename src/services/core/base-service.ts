import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReAuth from './custom-fetch-service';

const baseService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  keepUnusedDataFor: 120,
  tagTypes: [
    'auth',
    'users',
    'user',
],
  endpoints: () => ({}),
});

export default baseService;
