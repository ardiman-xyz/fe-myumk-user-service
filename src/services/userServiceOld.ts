// src/services/userService.ts
import apiClient from "@/config/api";
import { useAuth } from "@/context/AuthProvider";
import React from "react";

// ================================
// TYPES & INTERFACES
// ================================

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
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
  user_roles?: UserRole[];
  sessions?: UserSession[];
  activity_logs?: UserActivityLog[];
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

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  assigned_by: number;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
  assigned_by_user?: User;
}

export interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivityLog {
  id: number;
  user_id: number;
  application_id?: number;
  activity: string;
  description?: string;
  ip_address: string;
  user_agent: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  is_active?: boolean;
}

export interface UserFilters {
  search?: string;
  status?: "active" | "inactive" | "";
  role?: string;
  sort_by?:
    | "id"
    | "username"
    | "email"
    | "first_name"
    | "last_name"
    | "created_at"
    | "last_login_at";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
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

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  meta: {
    pagination: {
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

// ================================
// API ERROR HANDLING
// ================================

export class UserServiceError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "UserServiceError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const apiError = error.response.data;
    throw new UserServiceError(
      apiError.message || "API request failed",
      error.response.status,
      apiError.errors
    );
  }

  if (error.code === "NETWORK_ERROR") {
    throw new UserServiceError("Network error. Please check your connection.");
  }

  throw new UserServiceError(error.message || "An unexpected error occurred");
};

// ================================
// USER SERVICE CLASS
// ================================

export class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token-user-service");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ================================
  // CRUD OPERATIONS
  // ================================

  /**
   * Get paginated list of users with filters
   */
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get single user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>(
        "/users",
        userData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Update existing user
   */
  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${id}`,
        userData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        `/users/${id}/toggle-status`,
        {},
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(
    id: number,
    password: string
  ): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(
        `/users/${id}/reset-password`,
        { password },
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // SEARCH & FILTERING
  // ================================

  /**
   * Search users by query string
   */
  async searchUsers(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(
        `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get only active users
   */
  async getActiveUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(
        "/users/active",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get users with their roles
   */
  async getUsersWithRoles(
    filters: UserFilters = {}
  ): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();
      params.append("include", "roles");

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // BULK OPERATIONS
  // ================================

  /**
   * Bulk update users status
   */
  async bulkUpdateStatus(
    userIds: number[],
    isActive: boolean
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch<ApiResponse<any>>(
        "/users/bulk-status",
        { user_ids: userIds, is_active: isActive },
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(userIds: number[]): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(
        "/users/bulk-delete",
        {
          data: { user_ids: userIds },
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // ROLE MANAGEMENT
  // ================================

  /**
   * Assign role to user
   */
  async assignRole(
    userId: number,
    roleId: number,
    expiresAt?: string
  ): Promise<ApiResponse<UserRole>> {
    try {
      const response = await apiClient.post<ApiResponse<UserRole>>(
        `/users/${userId}/roles`,
        { role_id: roleId, expires_at: expiresAt },
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: number, roleId: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}/roles/${roleId}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: number): Promise<ApiResponse<UserRole[]>> {
    try {
      const response = await apiClient.get<ApiResponse<UserRole[]>>(
        `/users/${userId}/roles`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // ACTIVITY & SESSIONS
  // ================================

  /**
   * Get user activity logs
   */
  async getUserActivity(
    userId: number,
    limit: number = 50
  ): Promise<ApiResponse<UserActivityLog[]>> {
    try {
      const response = await apiClient.get<ApiResponse<UserActivityLog[]>>(
        `/users/${userId}/activity?limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get user active sessions
   */
  async getUserSessions(userId: number): Promise<ApiResponse<UserSession[]>> {
    try {
      const response = await apiClient.get<ApiResponse<UserSession[]>>(
        `/users/${userId}/sessions`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Terminate user session
   */
  async terminateSession(
    userId: number,
    sessionId: number
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}/sessions/${sessionId}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // STATISTICS & ANALYTICS
  // ================================

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>("/users/stats", {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Get user login history
   */
  async getUserLoginHistory(
    userId: number,
    days: number = 30
  ): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(
        `/users/${userId}/login-history?days=${days}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // EXPORT & IMPORT
  // ================================

  /**
   * Export users to CSV
   */
  async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(
        `/users/export?${params.toString()}`,
        {
          headers: this.getAuthHeaders(),
          responseType: "blob",
        }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Import users from CSV
   */
  async importUsers(file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<ApiResponse<any>>(
        "/users/import",
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(
    username: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/users/check-username?username=${encodeURIComponent(username)}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(
    email: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/users/check-email?email=${encodeURIComponent(email)}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  /**
   * Generate user avatar URL
   */
  generateAvatarUrl(user: User): string {
    if (user.avatar) {
      return user.avatar.startsWith("http")
        ? user.avatar
        : `${process.env.REACT_APP_API_URL}/storage/avatars/${user.avatar}`;
    }

    // Generate initials avatar
    const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
  }

  /**
   * Format user full name
   */
  formatUserName(user: User): string {
    return `${user.first_name} ${user.last_name}`.trim();
  }

  /**
   * Get user display name (full name or username)
   */
  getUserDisplayName(user: User): string {
    const fullName = this.formatUserName(user);
    return fullName || user.username;
  }

  /**
   * Check if user has specific role
   */
  userHasRole(user: User, roleName: string): boolean {
    return user.roles?.some((role) => role.name === roleName) || false;
  }

  /**
   * Get user status badge info
   */
  getUserStatusBadge(user: User): {
    text: string;
    variant: "success" | "destructive" | "secondary";
  } {
    if (user.is_active) {
      return { text: "Active", variant: "success" };
    }
    return { text: "Inactive", variant: "destructive" };
  }
}

// ================================
// SERVICE INSTANCE
// ================================

export const userService = new UserService();

// ================================
// REACT HOOKS
// ================================

/**
 * Custom hook for user operations
 */
export const useUserService = () => {
  return {
    ...userService,
    UserServiceError,
  };
};

/**
 * Custom hook for user list management
 */
export const useUserList = (initialFilters: UserFilters = {}) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<UserFilters>(initialFilters);
  const [pagination, setPagination] = React.useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
    has_more_pages: false,
  });

  const loadUsers = React.useCallback(
    async (newFilters?: UserFilters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.getUsers(newFilters || filters);

        if (response.success && response.data) {
          setUsers(response.data);
          if (response.meta?.pagination) {
            setPagination(response.meta.pagination);
          }
        } else {
          setError(response.message || "Failed to load users");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = React.useCallback(
    (newFilters: Partial<UserFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      loadUsers(updatedFilters);
    },
    [filters, loadUsers]
  );

  React.useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    filters,
    pagination,
    loadUsers,
    updateFilters,
    setUsers,
  };
};
