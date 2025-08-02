// src/types/user.ts
import { z, ZodError } from 'zod';

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
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
}

// Zod validation schema for creating user
export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must not exceed 255 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Please enter a valid phone number'),
  
  is_active: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type inference from Zod schema
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// API request type (without confirmPassword)
export type CreateUserRequest = Omit<CreateUserFormData, 'confirmPassword'>;

// Update user schema (all fields optional except confirmPassword logic)
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must not exceed 255 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .optional(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .optional(),
  
  confirmPassword: z.string().optional(),
  
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .optional(),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
    .optional(),
  
  phone: z
    .string()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Please enter a valid phone number')
    .optional(),
  
  is_active: z.boolean().optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Form field types for better organization
export interface FormField {
  name: keyof CreateUserFormData;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'checkbox';
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
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
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

// Guidelines and help content
export interface UserFormGuidelines {
  username: string[];
  password: string[];
  general: string[];
  nextSteps: string[];
}

export const USER_FORM_GUIDELINES: UserFormGuidelines = {
  username: [
    'Must be unique across the system',
    'Only letters, numbers, and underscores allowed',
    'Minimum 3 characters, maximum 255 characters',
    'Cannot be changed after creation'
  ],
  password: [
    'Minimum 8 characters required',
    'Must contain uppercase letter',
    'Must contain lowercase letter',
    'Must contain at least one number',
    'Special characters recommended'
  ],
  general: [
    'All required fields must be filled',
    'Email must be unique and valid',
    'Phone number is optional but must be valid if provided',
    'Account will be created as active by default'
  ],
  nextSteps: [
    'Assign appropriate roles to the user',
    'Configure specific permissions if needed',
    'Send welcome email with login instructions',
    'Set up department and team assignments'
  ]
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
     mode: 'create' | 'edit' = 'create'
  ): string | null {

  if (mode === 'edit' && (fieldName === 'password' || fieldName === 'confirmPassword')) {
      if (!value || value === '') {
        return null; // Valid - no password change
      }
    }

    try {
      const schema = createUserSchema.pick({ [fieldName]: true });
      schema.parse({ [fieldName]: value });
         if (mode === 'edit' && fieldName === 'password' && (!value || value === '')) {
    return null;
  }
      
      // Special case for confirmPassword
      if (fieldName === 'confirmPassword' && formData?.password !== value) {
        return "Passwords don't match";
      }
      
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || 'Invalid value';
      }
      return 'Validation error';
    }
  }

  static validateForm(data: CreateUserFormData): Record<string, string> {

    
    try {
      createUserSchema.parse(data);
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
      return { general: 'Validation failed' };
    }
  }
}