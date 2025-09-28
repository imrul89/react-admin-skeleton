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
    'roles',
    'role',
    'role-permissions',
    'permissions',
    'permission',
    'classes',
    'class',
    'school-classes',
    'school-class',
    'students',
    'student',
],
  endpoints: () => ({}),
});

export default baseService;
