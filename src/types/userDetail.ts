// src/types/userDetail.ts

export interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  roles_count: number;
  permissions_count: number;
  applications_count: number;
}

export interface RoleAssignment {
  role_id: number;
  role_name: string;
  role_code: string;
  role_description?: string;
  is_admin: boolean;
  assigned_by: number;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface DirectApplicationPrivilege {
  application_id: number;
  application_name: string;
  application_code: string;
  granted_by: number;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

export interface DirectPermissionPrivilege {
  permission_id: number;
  permission_name: string;
  permission_code: string;
  permission_resource: string;
  permission_action: string;
  granted_by: number;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

export interface ApplicationPermission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  is_checked: boolean;
}

export interface MenuPermission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  menu_id: number;
  is_checked: boolean;
}

export interface Menu {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
  permissions: MenuPermission[];
}

export interface Application {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active: boolean;
  is_checked: boolean;
  permissions: ApplicationPermission[];
  menus: Menu[];
}

export interface AvailableRole {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  is_assigned: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: number;
  activity: string;
  description?: string;
  ip_address: string;
  created_at: string;
}

export interface UserSession {
  id: number;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
}

export interface UserPrivilegeStats {
  roles_count: number;
  direct_applications_count: number;
  direct_permissions_count: number;
  active_sessions_count: number;
  recent_activities_count: number;
}

export interface UserDetailResponse {
  user: UserDetail;
  available_applications: Application[];
  available_roles: AvailableRole[];
  role_assignments: RoleAssignment[];
  direct_privileges: {
    applications: DirectApplicationPrivilege[];
    permissions: DirectPermissionPrivilege[];
  };
  statistics: UserPrivilegeStats;
  recent_activity: UserActivity[];
  active_sessions: UserSession[];
}

export interface UserDetailApiResponse {
  success: boolean;
  message: string;
  data: UserDetailResponse;
}

// Form interfaces for updating user detail
export interface UpdateUserDetailRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}
