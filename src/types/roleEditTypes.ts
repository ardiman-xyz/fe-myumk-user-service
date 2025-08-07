// Role Edit Types dengan is_checked support

export interface PermissionWithChecked {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  menu_id?: number;
  is_checked: boolean;
}

export interface MenuWithChecked {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
  permissions: PermissionWithChecked[];
}

export interface ApplicationWithChecked {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active: boolean;
  is_checked: boolean;
  permissions: PermissionWithChecked[];
  menus: MenuWithChecked[];
}

export interface RoleForEdit {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  users_count: number;
  permissions_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoleEditResponse {
  role: RoleForEdit;
  available_applications: ApplicationWithChecked[];
}

export interface RoleEditFormData {
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  applications: number[];
  permissions: number[];
}

export interface RoleEditApiRequest {
  name?: string;
  description?: string;
  is_admin?: boolean;
  is_active?: boolean;
  applications?: number[];
  permissions?: number[];
}
