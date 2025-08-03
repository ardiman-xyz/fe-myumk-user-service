// src/types/role.ts
export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users_count?: number;
  permissions_count?: number;
  applications_count?: number;
  permissions?: Permission[];
  applications?: Application[];
  users?: User[];
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
  roles_count?: number;
}

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
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Form Data Types
export interface CreateRoleFormData {
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  permissions: number[];
  applications: number[];
}

export interface UpdateRoleFormData extends Partial<CreateRoleFormData> {
  id: number;
}

// API Request Types
export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  is_admin?: boolean;
  is_active?: boolean;
  permissions?: number[];
  applications?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  is_admin?: boolean;
  is_active?: boolean;
  permissions?: number[];
  applications?: number[];
}

export interface AssignPermissionsRequest {
  permission_ids: number[];
}

export interface AssignUsersRequest {
  user_ids: number[];
  expires_at?: string;
}

export interface DuplicateRoleRequest {
  name: string;
  code: string;
  description?: string;
}

// Filter and Search Types
export interface RoleFilters {
  search?: string;
  status?: "active" | "inactive" | "";
  is_admin?: boolean | "";
  sort_by?:
    | "created_at"
    | "name"
    | "code"
    | "users_count"
    | "permissions_count";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

// API Response Types
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
  };
}

export interface RoleStats {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  admin_roles: number;
  user_roles: number;
  roles_with_users: number;
  roles_without_users: number;
  most_assigned_role?: Role;
  recent_roles: Role[];
}

// Validation and Form Helper Types
export interface RoleFormErrors {
  name?: string;
  code?: string;
  description?: string;
  permissions?: string;
  applications?: string;
}

export interface RoleQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

// Form Validation Rules
export const ROLE_FORM_GUIDELINES = {
  name: [
    "Use descriptive names like 'Content Manager' or 'Sales Administrator'",
    "Avoid generic names like 'Role1' or 'Test'",
    "Names should be 3-255 characters long",
    "Use title case for professional appearance",
  ],
  code: [
    "Use lowercase with underscores: 'content_manager'",
    "Must be unique across all roles",
    "Only letters, numbers, and underscores allowed",
    "Cannot be changed after creation",
  ],
  permissions: [
    "Grant only necessary permissions (principle of least privilege)",
    "Group related permissions logically",
    "Admin roles inherit most permissions automatically",
    "Review permissions regularly for security",
  ],
  general: [
    "Test roles in development environment first",
    "Document role purposes for team clarity",
    "Regular audit of role assignments recommended",
    "Inactive roles are hidden from user assignment",
  ],
  nextSteps: [
    "Assign role to users after creation",
    "Test role permissions in different applications",
    "Set up role-based menu access if needed",
    "Monitor role usage and effectiveness",
  ],
};

// Form Validator Class
export class RoleFormValidator {
  static validateField(
    fieldName: keyof CreateRoleFormData,
    value: any,
    formData: CreateRoleFormData,
    mode: "create" | "edit" = "create"
  ): string | null {
    switch (fieldName) {
      case "name":
        if (!value || value.trim().length === 0) {
          return "Role name is required";
        }
        if (value.trim().length < 3) {
          return "Role name must be at least 3 characters long";
        }
        if (value.trim().length > 255) {
          return "Role name cannot exceed 255 characters";
        }
        break;

      case "code":
        if (!value || value.trim().length === 0) {
          return "Role code is required";
        }
        if (!/^[a-z0-9_]+$/.test(value)) {
          return "Role code can only contain lowercase letters, numbers, and underscores";
        }
        if (value.length < 3) {
          return "Role code must be at least 3 characters long";
        }
        if (value.length > 255) {
          return "Role code cannot exceed 255 characters";
        }
        break;

      case "description":
        if (value && value.length > 1000) {
          return "Description cannot exceed 1000 characters";
        }
        break;

      case "permissions":
        // Permissions are optional, but warn if none selected for non-admin roles
        if (!formData.is_admin && (!value || value.length === 0)) {
          return "Consider adding permissions for non-admin roles";
        }
        break;

      case "applications":
        // Applications are optional, but recommend at least one for usability
        if (!value || value.length === 0) {
          return "Consider adding at least one application for better user experience";
        }
        break;

      default:
        break;
    }

    return null;
  }

  static validateForm(formData: CreateRoleFormData): RoleFormErrors {
    const errors: RoleFormErrors = {};

    // Validate each field
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof CreateRoleFormData;
      const error = this.validateField(
        fieldName,
        formData[fieldName],
        formData
      );
      // Only assign error if fieldName is a key of RoleFormErrors
      if (
        error &&
        ["name", "code", "description", "permissions", "applications"].includes(
          fieldName
        )
      ) {
        errors[fieldName as keyof RoleFormErrors] = error;
      }
    });

    return errors;
  }

  static isFormValid(formData: CreateRoleFormData): boolean {
    const errors = this.validateForm(formData);
    return Object.keys(errors).length === 0;
  }
}

// Utility Functions
export const getRoleDisplayName = (role: Role): string => {
  return role.name || role.code;
};

export const getRoleStatusBadge = (
  role: Role
): { text: string; variant: "success" | "destructive" | "secondary" } => {
  if (role.is_active) {
    return { text: "Active", variant: "success" };
  }
  return { text: "Inactive", variant: "destructive" };
};

export const getRoleTypeBadge = (
  role: Role
): { text: string; variant: "default" | "secondary" } => {
  if (role.is_admin) {
    return { text: "Admin Role", variant: "default" };
  }
  return { text: "User Role", variant: "secondary" };
};

export const formatRolePermissions = (role: Role): string => {
  const count = role.permissions_count || role.permissions?.length || 0;
  return `${count} permission${count !== 1 ? "s" : ""}`;
};

export const formatRoleUsers = (role: Role): string => {
  const count = role.users_count || role.users?.length || 0;
  return `${count} user${count !== 1 ? "s" : ""}`;
};

export const formatRoleApplications = (role: Role): string => {
  const count = role.applications_count || role.applications?.length || 0;
  return `${count} application${count !== 1 ? "s" : ""}`;
};
