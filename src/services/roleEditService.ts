import apiClient from "@/config/api";
import type {
  RoleEditResponse,
  RoleEditApiRequest,
  ApplicationWithChecked,
} from "@/types/roleEditTypes";
import { tokenManager } from "@/utils/tokenManager";

export class RoleEditService {
  private async getAuthHeaders() {
    const token = await tokenManager.getValidAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get role by ID with applications and permissions (with is_checked status)
   */
  async getRoleForEdit(id: number): Promise<{
    success: boolean;
    message: string;
    data?: RoleEditResponse;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: RoleEditResponse;
      }>(`/roles/${id}`, {
        headers: await this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch role for edit");
    }
  }

  /**
   * Get applications with permissions for create role (all unchecked)
   */
  async getApplicationsForCreate(): Promise<{
    success: boolean;
    message: string;
    data?: ApplicationWithChecked[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ApplicationWithChecked[];
      }>("/roles/applications-for-create", {
        headers: await this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch applications for create");
    }
  }

  /**
   * Update role with applications and permissions
   */
  async updateRole(
    id: number,
    data: RoleEditApiRequest
  ): Promise<{
    success: boolean;
    message: string;
    data?: RoleEditResponse;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: RoleEditResponse;
      }>(`/roles/${id}`, data, {
        headers: await this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update role");
    }
  }

  /**
   * Create role with applications and permissions
   */
  async createRole(data: RoleEditApiRequest & { code: string }): Promise<{
    success: boolean;
    message: string;
    data?: RoleEditResponse;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: RoleEditResponse;
      }>("/roles", data, {
        headers: await this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create role");
    }
  }
}

export const roleEditService = new RoleEditService();
