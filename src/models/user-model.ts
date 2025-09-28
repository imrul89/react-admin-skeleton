import { Role } from '@models/role-model';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: Role[];
  status: number;
}

export interface Users {
  users: User[];
  totalNumberOfRows: number;
}

export type UserPartial = Partial<User>;

export interface UserFormData {
  id?: number;
  name: string;
  username: string;
  password?: string;
  email?: string;
  role_ids: number[];
  status: number;
}

export interface UserDetails {
  id: number;
  name: string;
  username: string;
  email: string;
  status: number;
  year: number;
  permissions?: string[];
}