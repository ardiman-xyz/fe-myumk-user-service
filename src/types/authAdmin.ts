export interface Admin {
  id: number;
  name: string;
  email: string;
  department_id?: number;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginFormData {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: Admin;
    token: string;
  };
  error?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamCategory {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  max_attempts: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  department_id?: number;
  department?: Department;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}
