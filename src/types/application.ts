export interface Application {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles_count?: number;
  menus_count?: number;
  roles?: Role[];
  menus?: Menu[];
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: number;
  application_id: number;
  parent_id?: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent?: Menu;
  children?: Menu[];
}

export interface ApplicationFilters {
  search?: string;
  status?: "active" | "inactive" | "";
  sort_by?:
    | "id"
    | "name"
    | "code"
    | "created_at"
    | "roles_count"
    | "menus_count";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreateApplicationRequest {
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active?: boolean;
}

export interface UpdateApplicationRequest {
  name?: string;
  code?: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      has_more_pages: boolean;
    };
    count?: number;
  };
}

export interface ApplicationStats {
  total_applications: number;
  active_applications: number;
  inactive_applications: number;
  applications_with_roles: number;
  applications_without_roles: number;
  applications_with_menus: number;
  most_used_application?: {
    id: number;
    name: string;
    roles_count: number;
  };
  recent_applications: Array<{
    id: number;
    name: string;
    created_at: string;
  }>;
}

export interface AssignRolesRequest {
  role_ids: number[];
}

export interface DuplicateApplicationRequest {
  name: string;
  code: string;
  description?: string;
}
