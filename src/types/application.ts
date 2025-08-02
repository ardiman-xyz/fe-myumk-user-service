import { z, ZodError } from "zod";

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

export const createApplicationSchema = z.object({
  name: z
    .string()
    .min(1, "Application name is required")
    .min(2, "Application name must be at least 2 characters")
    .max(255, "Application name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_\.]+$/,
      "Application name can only contain letters, numbers, spaces, hyphens, underscores, and dots"
    ),

  code: z
    .string()
    .min(1, "Application code is required")
    .min(2, "Application code must be at least 2 characters")
    .max(255, "Application code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Application code can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase()),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  url: z
    .string()
    .url("Please enter a valid URL (including http:// or https://)")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  icon: z
    .string()
    .max(255, "Icon name must not exceed 255 characters")
    .optional(),

  is_active: z.boolean().default(true),
});

// Type inference from Zod schema
export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;

// Update application schema (all fields optional except validation logic)
export const updateApplicationSchema = z.object({
  name: z
    .string()
    .min(2, "Application name must be at least 2 characters")
    .max(255, "Application name must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_\.]+$/,
      "Application name can only contain letters, numbers, spaces, hyphens, underscores, and dots"
    )
    .optional(),

  code: z
    .string()
    .min(2, "Application code must be at least 2 characters")
    .max(255, "Application code must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Application code can only contain letters, numbers, and underscores"
    )
    .transform((str) => str.toLowerCase())
    .optional(),

  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  url: z
    .string()
    .url("Please enter a valid URL (including http:// or https://)")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  icon: z
    .string()
    .max(255, "Icon name must not exceed 255 characters")
    .optional(),

  is_active: z.boolean().optional(),
});

export type UpdateApplicationFormData = z.infer<typeof updateApplicationSchema>;

// Form guidelines and help content
export interface ApplicationFormGuidelines {
  name: string[];
  code: string[];
  url: string[];
  icon: string[];
  general: string[];
  nextSteps: string[];
}

export const APPLICATION_FORM_GUIDELINES: ApplicationFormGuidelines = {
  name: [
    "Use descriptive names that clearly identify the application",
    "Keep names concise but meaningful",
    "Avoid technical jargon or abbreviations",
    "Use title case for better readability",
  ],
  code: [
    "Must be unique across the system",
    "Use lowercase with underscores for separation",
    "Should be short but descriptive",
    "Cannot be changed after creation",
    "Will be used in URLs and API calls",
  ],
  url: [
    "Should include the full URL with protocol (http:// or https://)",
    "This URL will be used for navigation and external links",
    "Ensure the URL is accessible to your users",
    "Leave empty if application has no web interface",
  ],
  icon: [
    "Use icon names from your icon library",
    "Common icons: globe, users, settings, file-text, bar-chart",
    "Icons help users quickly identify applications",
    "Leave empty to use default globe icon",
  ],
  general: [
    "All required fields must be filled",
    "Application code must be unique and cannot be changed",
    "Active applications are available for role assignment",
    "Inactive applications are hidden from users",
  ],
  nextSteps: [
    "Configure application menus and navigation",
    "Set up role-based access controls",
    "Create application-specific permissions",
    "Test application integration and access",
  ],
};

// Available application icons
export const AVAILABLE_ICONS = [
  { name: "globe", label: "Globe", description: "General web application" },
  { name: "users", label: "Users", description: "User management system" },
  { name: "shield", label: "Shield", description: "Security or admin tools" },
  {
    name: "settings",
    label: "Settings",
    description: "Configuration or admin panel",
  },
  {
    name: "file-text",
    label: "File Text",
    description: "Content management system",
  },
  {
    name: "bar-chart",
    label: "Bar Chart",
    description: "Analytics or reporting",
  },
  {
    name: "shopping-cart",
    label: "Shopping Cart",
    description: "E-commerce platform",
  },
  {
    name: "help-circle",
    label: "Help Circle",
    description: "Support or help system",
  },
  {
    name: "database",
    label: "Database",
    description: "Data management system",
  },
  { name: "mail", label: "Mail", description: "Email or messaging system" },
  {
    name: "calendar",
    label: "Calendar",
    description: "Scheduling or calendar app",
  },
  { name: "image", label: "Image", description: "Media or gallery system" },
  { name: "lock", label: "Lock", description: "Security or authentication" },
  {
    name: "credit-card",
    label: "Credit Card",
    description: "Payment or billing system",
  },
  {
    name: "truck",
    label: "Truck",
    description: "Logistics or delivery system",
  },
];

// Quick actions configuration
export interface ApplicationQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

// Form validation helpers
export class ApplicationFormValidator {
  static validateField(
    fieldName: keyof CreateApplicationFormData,
    value: any,
    formData?: Partial<CreateApplicationFormData>,
    mode: "create" | "edit" = "create"
  ): string | null {
    try {
      const schema = createApplicationSchema.pick({ [fieldName]: true });
      schema.parse({ [fieldName]: value });
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Invalid value";
      }
      return "Validation error";
    }
  }

  static validateForm(data: CreateApplicationFormData): Record<string, string> {
    try {
      createApplicationSchema.parse(data);
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
    applicationId?: number
  ): Promise<boolean> {
    // This would typically call the API to check uniqueness
    // For now, return true (valid)
    // In real implementation:
    // const response = await applicationService.checkCodeAvailability(code, applicationId);
    // return response.data?.available || false;
    return true;
  }

  static generateCodeFromName(name: string): string {
    if (!name) return "";

    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
  }
}
