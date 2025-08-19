import React from 'react';

export interface EnvVariables {
  API_BASE_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}

export type EnvVariablePartial = Partial<EnvVariables>;

export interface ReportErrorData {
  server_timestamp: number;
  server_timestamp_human_readable: string;
  url: string;
  http_method: string;
  error_type: string;
  message: string;
}

export interface AppError {
  data: {
    errors?: string[];
  }
}

export interface MultipleAppError {
  data: {
    messages: [
      {description: string}
    ];
  }
}

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export interface QueryParams {
  [key: string]: any;
}

export interface Option {
  label: string;
  value: string | number | boolean;
  title?: string;
  owned_publishers?: boolean;
}

export type Options = Record<string, Option>;

export interface PreparedOption {
  label: string;
  value: string | number | boolean;
}

export interface TableDataCountProps {
  users?: number;
}
