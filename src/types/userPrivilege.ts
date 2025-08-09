import type { User } from "./user";

export interface GrantApplicationAccessFormData {
  user_id: number;
  application_id: number;
  expires_at?: string;
  notes?: string;
}

export interface GrantMenuAccessFormData {
  user_id: number;
  menu_id: number;
  permissions: ("view" | "create" | "edit" | "delete")[];
  expires_at?: string;
  notes?: string;
}

export interface GrantPermissionAccessFormData {
  user_id: number;
  permission_id: number;
  expires_at?: string;
  notes?: string;
}

// Bulk operations
export interface BulkGrantAccessFormData {
  user_ids: number[];
  application_id?: number;
  menu_id?: number;
  permission_id?: number;
  menu_permissions?: ("view" | "create" | "edit" | "delete")[];
  expires_at?: string;
  notes?: string;
}

// Filter untuk user privileges
export interface UserPrivilegeFilters {
  user_id?: number;
  application_id?: number;
  menu_id?: number;
  permission_id?: number;
  granted_by?: number;
  status?: "active" | "inactive" | "expired" | "";
  expires_soon?: boolean; // untuk privilege yang akan expire dalam 30 hari
  search?: string;
  sort_by?: "granted_at" | "expires_at" | "user_name" | "resource_name";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

// Response untuk user access check
export interface UserAccessCheckResponse {
  has_access: boolean;
  access_source: "role" | "direct" | "none";
  permissions?: {
    view?: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  expires_at?: string;
  granted_by?: string;
}

// Summary privilege user
export interface UserPrivilegeSummary {
  user: User;
  role_access: {
    applications: number;
    menus: number;
    permissions: number;
  };
  direct_access: {
    applications: number;
    menus: number;
    permissions: number;
  };
  total_access: {
    applications: number;
    menus: number;
    permissions: number;
  };
  expiring_soon: {
    applications: number;
    menus: number;
    permissions: number;
  };
}
