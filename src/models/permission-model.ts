export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface Permissions {
  permissions: Permission[];
  totalNumberOfRows: number;
}

export type PermissionPartial = Partial<Permission>;