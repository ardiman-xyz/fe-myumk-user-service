// src/types/user.ts
import { z, ZodError } from "zod";

// Base User interface
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
  roles?: Role[];
  roles_count?: number;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  users_count?: number;
  permissions_count?: number;
  applications_count?: number;
}

// Zod validation schema for creating user
export const createUserSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(255, "Username must not exceed 255 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    first_name: z
      .string()
      .min(1, "First name is required")
      .max(255, "First name must not exceed 255 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(255, "Last name must not exceed 255 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val),
        "Please enter a valid phone number"
      ),

    is_active: z.boolean().default(true),

    // Add roles field for user creation
    roles: z
      .array(z.number())
      .min(1, "Please select at least one role")
      .max(10, "Cannot assign more than 10 roles"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type inference from Zod schema
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// API request type (without confirmPassword)
export type CreateUserRequest = Omit<CreateUserFormData, "confirmPassword">;

// Update user schema (all fields optional except confirmPassword logic)
export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(255, "Username must not exceed 255 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters")
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      )
      .optional(),

    confirmPassword: z.string().optional(),

    first_name: z
      .string()
      .min(1, "First name is required")
      .max(255, "First name must not exceed 255 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
      .optional(),

    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(255, "Last name must not exceed 255 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
      .optional(),

    phone: z
      .string()
      .refine(
        (val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val),
        "Please enter a valid phone number"
      )
      .optional(),

    is_active: z.boolean().optional(),

    // Add roles field for user updates (optional)
    roles: z
      .array(z.number())
      .max(10, "Cannot assign more than 10 roles")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// API request type for update (without confirmPassword)
export type UpdateUserRequest = Omit<UpdateUserFormData, "confirmPassword">;

// Form field types for better organization
export interface FormField {
  name: keyof CreateUserFormData;
  label: string;
  type: "text" | "email" | "password" | "tel" | "checkbox";
  placeholder?: string;
  required?: boolean;
  description?: string;
}

// API Response types
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

// User filters for list/search
export interface UserFilters {
  search?: string;
  status?: string;
  role?: string;
  role_id?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

// Form state management
export interface FormState {
  data: CreateUserFormData;
  errors: Partial<Record<keyof CreateUserFormData, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// User statistics type
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  verified_users: number;
  unverified_users: number;
  recent_registrations: number;
  users_by_role: Array<{
    role_id: number;
    role_name: string;
    user_count: number;
  }>;
}

// Guidelines and help content
export interface UserFormGuidelines {
  username: string[];
  password: string[];
  roles: string[];
  general: string[];
  nextSteps: string[];
}

export const USER_FORM_GUIDELINES: UserFormGuidelines = {
  username: [
    "Must be unique across the system",
    "Only letters, numbers, and underscores allowed",
    "Minimum 3 characters, maximum 255 characters",
    "Cannot be changed after creation",
  ],
  password: [
    "Minimum 8 characters required",
    "Must contain uppercase letter",
    "Must contain lowercase letter",
    "Must contain at least one number",
    "Special characters recommended",
  ],
  roles: [
    "At least one role must be assigned",
    "Maximum 10 roles can be assigned",
    "Users inherit permissions from assigned roles",
    "Admin roles have elevated privileges",
    "Role assignments can be modified later",
  ],
  general: [
    "All required fields must be filled",
    "Email must be unique and valid",
    "Phone number is optional but must be valid if provided",
    "Account will be created as active by default",
  ],
  nextSteps: [
    "Review assigned roles and permissions",
    "Configure specific permissions if needed",
    "Send welcome email with login instructions",
    "Set up department and team assignments",
    "Schedule user onboarding session",
  ],
};

// Quick actions configuration
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

// Form validation helpers
export class UserFormValidator {
  static validateField(
    fieldName: keyof CreateUserFormData,
    value: any,
    formData?: Partial<CreateUserFormData>,
    mode: "create" | "edit" = "create"
  ): string | null {
    // Special handling for password fields in edit mode
    if (
      mode === "edit" &&
      (fieldName === "password" || fieldName === "confirmPassword")
    ) {
      if (!value || value === "") {
        return null; // Valid - no password change
      }
    }

    // Special handling for roles
    if (fieldName === "roles") {
      if (mode === "create" && (!value || value.length === 0)) {
        return "Please select at least one role";
      }
      if (value && value.length > 10) {
        return "Cannot assign more than 10 roles";
      }
      return null;
    }

    try {
      const schema = mode === "create" ? createUserSchema : updateUserSchema;
      const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];

      if (fieldSchema) {
        fieldSchema.parse(value);
      }

      // Special case for confirmPassword
      if (fieldName === "confirmPassword" && formData?.password !== value) {
        if (
          mode === "edit" &&
          (!formData?.password || formData.password === "")
        ) {
          return null; // No password change, so confirm not needed
        }
        return "Passwords don't match";
      }

      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Invalid value";
      }
      return "Validation error";
    }
  }

  static validateForm(
    data: CreateUserFormData | UpdateUserFormData,
    mode: "create" | "edit" = "create"
  ): Record<string, string> {
    try {
      const schema = mode === "create" ? createUserSchema : updateUserSchema;
      schema.parse(data);

      // Additional role validation for create mode
      if (
        mode === "create" &&
        "roles" in data &&
        Array.isArray(data.roles) &&
        data.roles.length === 0
      ) {
        return { roles: "Please select at least one role" };
      }

      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message;
          }
        });

        // Additional role validation for create mode
        if (
          mode === "create" &&
          "roles" in data &&
          Array.isArray(data.roles) &&
          data.roles.length === 0
        ) {
          errors.roles = "Please select at least one role";
        }

        return errors;
      }
      return { general: "Validation failed" };
    }
  }

  static validateRoles(
    roles: number[],
    mode: "create" | "edit" = "create"
  ): string | null {
    if (mode === "create" && roles.length === 0) {
      return "Please select at least one role";
    }
    if (roles.length > 10) {
      return "Cannot assign more than 10 roles";
    }
    return null;
  }
}

// User role assignment types
export interface UserRoleAssignment {
  user_id: number;
  role_id: number;
  assigned_by: number;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
}

// Bulk user operations
export interface BulkUserOperation {
  type: "activate" | "deactivate" | "delete" | "assign_role" | "remove_role";
  user_ids: number[];
  role_id?: number; // For role operations
  expires_at?: string; // For role assignment
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    user_id: number;
    error: string;
  }>;
}
