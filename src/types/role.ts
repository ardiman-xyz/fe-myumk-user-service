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
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  full_name: string;
}

export interface RoleFilters {
  search?: string;
  status?: "active" | "inactive" | "";
  is_admin?: boolean | "";
  sort_by?:
    | "id"
    | "name"
    | "code"
    | "created_at"
    | "users_count"
    | "permissions_count";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

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
  code?: string;
  description?: string;
  is_admin?: boolean;
  is_active?: boolean;
  permissions?: number[];
  applications?: number[];
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

export interface RoleStats {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  admin_roles: number;
  user_roles: number;
  roles_with_users: number;
  roles_without_users: number;
  most_assigned_role?: {
    id: number;
    name: string;
    users_count: number;
  };
  recent_roles: Array<{
    id: number;
    name: string;
    created_at: string;
  }>;
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

// src/types/role.ts - Add these types to the existing role types file

import { z, ZodError } from "zod";

// Zod validation schema for creating role
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(255, "Role name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  code: z
    .string()
    .min(1, "Role code is required")
    .min(2, "Role code must be at least 2 characters")
    .max(255, "Role code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Role code can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase()),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  is_admin: z.boolean().default(false),
  is_active: z.boolean().default(true),

  permissions: z.array(z.number()).optional(),

  applications: z.array(z.number()).optional(),
});

// Type inference from Zod schema
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

// Update role schema (all fields optional except validation logic)
export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters")
    .max(255, "Role name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .optional(),

  code: z
    .string()
    .min(2, "Role code must be at least 2 characters")
    .max(255, "Role code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Role code can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase())
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  is_admin: z.boolean().optional(),
  is_active: z.boolean().optional(),

  permissions: z.array(z.number()).optional(),

  applications: z.array(z.number()).optional(),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

// Form guidelines and help content
export interface RoleFormGuidelines {
  name: string[];
  code: string[];
  permissions: string[];
  general: string[];
  nextSteps: string[];
}

export const ROLE_FORM_GUIDELINES: RoleFormGuidelines = {
  name: [
    "Use descriptive names that clearly indicate the role purpose",
    "Avoid abbreviations unless commonly understood",
    "Keep names concise but meaningful",
    "Use title case for better readability",
  ],
  code: [
    "Must be unique across the system",
    "Use lowercase with underscores for separation",
    "Should be short but descriptive",
    "Cannot be changed after creation",
  ],
  permissions: [
    "Select only necessary permissions for the role",
    "Follow principle of least privilege",
    "Consider user workflow when assigning permissions",
    "Review permissions regularly for security",
  ],
  general: [
    "All required fields must be filled",
    "Role code must be unique and cannot be changed",
    "Admin roles have elevated system privileges",
    "Inactive roles cannot be assigned to users",
  ],
  nextSteps: [
    "Assign permissions based on role requirements",
    "Test role functionality with test users",
    "Document role purpose and responsibilities",
    "Set up role-based access controls",
  ],
};

// Quick actions configuration
export interface RoleQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

// Form validation helpers
export class RoleFormValidator {
  static validateField(
    fieldName: keyof CreateRoleFormData,
    value: any,
    formData?: Partial<CreateRoleFormData>,
    mode: "create" | "edit" = "create"
  ): string | null {
    try {
      const schema = createRoleSchema.pick({ [fieldName]: true });
      schema.parse({ [fieldName]: value });
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Invalid value";
      }
      return "Validation error";
    }
  }

  static validateForm(data: CreateRoleFormData): Record<string, string> {
    try {
      createRoleSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        return errors;
      }
      return { general: "Validation failed" };
    }
  }

  static async validateUniqueCode(
    code: string,
    roleId?: number
  ): Promise<boolean> {
    // This would typically call an API to check uniqueness
    // For now, return true (valid)
    // In real implementation:
    // const response = await roleService.checkCodeAvailability(code, roleId);
    // return response.available;
    return true;
  }
}
