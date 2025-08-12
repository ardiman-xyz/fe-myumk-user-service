// src/services/userService.ts
import apiClient from "@/config/api";
import type { User } from "@/types/user";
import { tokenManager } from "@/utils/tokenManager";

// ================================
// TYPES & INTERFACES
// ================================

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UserFilters {
  search?: string;
  status?: "active" | "inactive" | "";
  sort_by?:
    | "id"
    | "username"
    | "email"
    | "first_name"
    | "last_name"
    | "created_at";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
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
  };
}

// ================================
// USER SERVICE
// ================================

class UserService {
  private async getAuthHeaders() {
    const token = await tokenManager.getValidAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get paginated list of users
   */
  async getUsers(filters: UserFilters = {}): Promise<ApiResponse<User[]>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<User[]>>(
        `/users?${params.toString()}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Get single user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`, {
        headers: await this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch user");
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
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create user");
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
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update user");
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${id}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to delete user");
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
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to toggle user status");
    }
  }

  /**
   * Search users
   */
  async searchUsers(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(
        `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to search users");
    }
  }

  /**
   * Get active users only
   */
  async getActiveUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(
        "/users/active",
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch active users");
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
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to reset password");
    }
  }
}

// Export service instance
export const userService = new UserService();
