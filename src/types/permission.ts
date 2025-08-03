import { z, ZodError } from "zod";

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
  users_count?: number;
}

export interface PermissionFilters {
  search?: string;
  resource?: string;
  action?: string;
  sort_by?: "id" | "name" | "code" | "resource" | "action" | "created_at";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreatePermissionRequest {
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  code?: string;
  description?: string;
  resource?: string;
  action?: string;
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

export interface PermissionStats {
  total_permissions: number;
  by_resource: Record<string, number>;
  by_action: Record<string, number>;
  recent_permissions: Array<{
    id: number;
    name: string;
    created_at: string;
  }>;
}

// Zod validation schema for creating permission
export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(1, "Permission name is required")
    .min(3, "Permission name must be at least 3 characters")
    .max(255, "Permission name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Permission name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  code: z
    .string()
    .min(1, "Permission code is required")
    .min(3, "Permission code must be at least 3 characters")
    .max(255, "Permission code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Permission code can only contain letters, numbers, dots, and underscores"
    )
    .transform((str) => str.toLowerCase()),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  resource: z
    .string()
    .min(1, "Resource is required")
    .min(2, "Resource must be at least 2 characters")
    .max(255, "Resource must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Resource can only contain letters, numbers, dots, and underscores"
    )
    .transform((str) => str.toLowerCase()),

  action: z
    .string()
    .min(1, "Action is required")
    .min(2, "Action must be at least 2 characters")
    .max(255, "Action must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Action can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase()),
});

// Type inference from Zod schema
export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;

// Update permission schema (all fields optional except validation logic)
export const updatePermissionSchema = z.object({
  name: z
    .string()
    .min(3, "Permission name must be at least 3 characters")
    .max(255, "Permission name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Permission name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .optional(),

  code: z
    .string()
    .min(3, "Permission code must be at least 3 characters")
    .max(255, "Permission code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Permission code can only contain letters, numbers, dots, and underscores"
    )
    .transform((str) => str.toLowerCase())
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  resource: z
    .string()
    .min(2, "Resource must be at least 2 characters")
    .max(255, "Resource must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Resource can only contain letters, numbers, dots, and underscores"
    )
    .transform((str) => str.toLowerCase())
    .optional(),

  action: z
    .string()
    .min(2, "Action must be at least 2 characters")
    .max(255, "Action must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Action can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase())
    .optional(),
});

export type UpdatePermissionFormData = z.infer<typeof updatePermissionSchema>;

// Form guidelines and help content
export interface PermissionFormGuidelines {
  name: string[];
  code: string[];
  resource: string[];
  action: string[];
  general: string[];
  nextSteps: string[];
}

export const PERMISSION_FORM_GUIDELINES: PermissionFormGuidelines = {
  name: [
    "Use clear, descriptive names that explain what the permission allows",
    "Follow the pattern: [Action] [Resource] (e.g., 'View Users', 'Create Posts')",
    "Use title case for better readability",
    "Avoid technical jargon or abbreviations",
  ],
  code: [
    "Must be unique across the system",
    "Use format: resource.action (e.g., 'users.view', 'posts.create')",
    "Use lowercase with dots and underscores only",
    "Should be short but descriptive",
    "Cannot be changed after creation",
  ],
  resource: [
    "Represents what is being accessed (e.g., 'users', 'posts', 'settings')",
    "Use singular form (e.g., 'user' not 'users')",
    "Use dots for hierarchy (e.g., 'user.profile', 'admin.settings')",
    "Keep consistent across related permissions",
  ],
  action: [
    "Represents what can be done (e.g., 'view', 'create', 'edit', 'delete')",
    "Use standard CRUD actions when possible",
    "Be specific (e.g., 'publish' instead of 'edit' for content)",
    "Use lowercase with underscores for multiple words",
  ],
  general: [
    "All required fields must be filled",
    "Permission code must be unique and cannot be changed",
    "Follow naming conventions for consistency",
    "Consider security implications when creating permissions",
  ],
  nextSteps: [
    "Assign permission to appropriate roles",
    "Test permission functionality",
    "Document permission purpose and usage",
    "Review and audit permission assignments regularly",
  ],
};

// Common actions for reference
export const COMMON_ACTIONS = [
  { value: "view", label: "View", description: "Read/view access to resource" },
  { value: "create", label: "Create", description: "Create new instances" },
  { value: "edit", label: "Edit", description: "Modify existing instances" },
  { value: "delete", label: "Delete", description: "Remove instances" },
  {
    value: "manage",
    label: "Manage",
    description: "Full administrative access",
  },
  {
    value: "publish",
    label: "Publish",
    description: "Publish or approve content",
  },
  { value: "export", label: "Export", description: "Export data" },
  { value: "import", label: "Import", description: "Import data" },
  {
    value: "approve",
    label: "Approve",
    description: "Approve requests or content",
  },
  { value: "assign", label: "Assign", description: "Assign to users or roles" },
];

// Common resource patterns
export const COMMON_RESOURCES = [
  { value: "users", label: "Users", description: "User management" },
  { value: "roles", label: "Roles", description: "Role management" },
  {
    value: "permissions",
    label: "Permissions",
    description: "Permission management",
  },
  {
    value: "applications",
    label: "Applications",
    description: "Application management",
  },
  { value: "menus", label: "Menus", description: "Menu management" },
  { value: "settings", label: "Settings", description: "System settings" },
  {
    value: "reports",
    label: "Reports",
    description: "Reporting and analytics",
  },
  { value: "logs", label: "Logs", description: "System logs and audit" },
];

// Quick actions configuration
export interface PermissionQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

// Form validation helpers
export class PermissionFormValidator {
  static validateField(
    fieldName: keyof CreatePermissionFormData,
    value: any,
    formData?: Partial<CreatePermissionFormData>,
    mode: "create" | "edit" = "create"
  ): string | null {
    try {
      const schema = createPermissionSchema.pick({ [fieldName]: true });
      schema.parse({ [fieldName]: value });
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Invalid value";
      }
      return "Validation error";
    }
  }

  static validateForm(data: CreatePermissionFormData): Record<string, string> {
    try {
      createPermissionSchema.parse(data);
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

  static generateCodeFromResourceAndAction(
    resource: string,
    action: string
  ): string {
    if (!resource || !action) return "";

    const cleanResource = resource.toLowerCase().replace(/[^a-zA-Z0-9_.]/g, "");
    const cleanAction = action.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "");

    return `${cleanResource}.${cleanAction}`;
  }

  static generateNameFromResourceAndAction(
    resource: string,
    action: string
  ): string {
    if (!resource || !action) return "";

    const capitalizeFirst = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    const cleanResource = resource.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    const cleanAction = action.replace(/[^a-zA-Z0-9\s]/g, " ").trim();

    return `${capitalizeFirst(cleanAction)} ${capitalizeFirst(cleanResource)}`;
  }

  static async validateUniqueCode(
    code: string,
    permissionId?: number
  ): Promise<boolean> {
    // This would typically call the API to check uniqueness
    // For now, return true (valid)
    // In real implementation:
    // const response = await permissionService.checkCodeAvailability(code, permissionId);
    // return response.data?.available || false;
    return true;
  }
}
