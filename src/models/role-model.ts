import { Permission } from '@models/permission-model';

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface Roles {
  roles: Role[];
  totalNumberOfRows: number;
}

export type RolePartial = Partial<Role>;