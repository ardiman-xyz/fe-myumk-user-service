// src/services/userDetailService.ts
import apiClient from "@/config/api";
import type {
  UserDetailApiResponse,
  UpdateUserDetailRequest,
  UserDetail,
} from "@/types/userDetail";
import { tokenManager } from "@/utils/tokenManager";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class UserDetailService {
  private async getAuthHeaders() {
    const token = await tokenManager.getValidAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get user detail with comprehensive information
   */
  async getUserDetail(id: number): Promise<UserDetailApiResponse> {
    try {
      const response = await apiClient.get<UserDetailApiResponse>(
        `/users/${id}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch user detail");
    }
  }

  /**
   * Update user personal information
   */
  async updateUserDetail(
    id: number,
    userData: UpdateUserDetailRequest
  ): Promise<ApiResponse<UserDetail>> {
    try {
      const response = await apiClient.put<ApiResponse<UserDetail>>(
        `/users/${id}`,
        userData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update user detail");
    }
  }

  /**
   * Update account security settings (password, is_active)
   */
  async updateAccountSecurity(
    id: number,
    securityData: { password?: string; is_active?: boolean }
  ): Promise<ApiResponse<UserDetail>> {
    try {
      const response = await apiClient.patch<ApiResponse<UserDetail>>(
        `/users/${id}/account-security`,
        securityData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update account security");
    }
  }

  /**
   * Manage direct access privileges (applications/permissions)
   */
  async managePrivileges(
    userId: number,
    privilegeData: {
      action: "grant" | "revoke" | "update";
      type: "application" | "permission";
      target_id: number;
      expires_at?: string;
      is_active?: boolean;
      notes?: string;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch<ApiResponse<any>>(
        `/users/${userId}/privileges`,
        privilegeData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to manage privileges");
    }
  }

  async manageRoles(
    userId: number,
    roleData: {
      action: "assign" | "remove" | "update";
      role_id: number;
      expires_at?: string;
      is_active?: boolean;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.patch<ApiResponse<any>>(
        `/users/${userId}/roles`,
        roleData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to manage roles");
    }
  }

  async toggleUserStatus(id: number): Promise<ApiResponse<UserDetail>> {
    try {
      const response = await apiClient.patch<ApiResponse<UserDetail>>(
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
   * Assign role to user
   */
  async assignRole(
    userId: number,
    roleId: number,
    expiresAt?: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/users/${userId}/roles`,
        { role_id: roleId, expires_at: expiresAt },
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to assign role");
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: number, roleId: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}/roles/${roleId}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to remove role");
    }
  }

  /**
   * Grant direct application access
   */
  async grantApplicationAccess(
    userId: number,
    applicationId: number,
    expiresAt?: string,
    notes?: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/users/${userId}/applications`,
        {
          application_id: applicationId,
          expires_at: expiresAt,
          notes,
        },
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to grant application access");
    }
  }

  /**
   * Revoke direct application access
   */
  async revokeApplicationAccess(
    userId: number,
    applicationId: number
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}/applications/${applicationId}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to revoke application access");
    }
  }

  /**
   * Grant direct permission
   */
  async grantPermission(
    userId: number,
    permissionId: number,
    expiresAt?: string,
    notes?: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `/users/${userId}/permissions`,
        {
          permission_id: permissionId,
          expires_at: expiresAt,
          notes,
        },
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to grant permission");
    }
  }

  /**
   * Revoke direct permission
   */
  async revokePermission(
    userId: number,
    permissionId: number
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/users/${userId}/permissions/${permissionId}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to revoke permission");
    }
  }
}

// Export service instance
export const userDetailService = new UserDetailService();
