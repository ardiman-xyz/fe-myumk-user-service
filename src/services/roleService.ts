// src/services/roleService.ts
import apiClient from "@/config/api";
import type {
  Role,
  RoleFilters,
  CreateRoleRequest,
  UpdateRoleRequest,
  ApiResponse,
  RoleStats,
  AssignPermissionsRequest,
  AssignUsersRequest,
  DuplicateRoleRequest,
  User,
} from "@/types/role";

class RoleService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token-user-service");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get paginated list of roles
   */
  async getRoles(filters: RoleFilters = {}): Promise<ApiResponse<Role[]>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Role[]>>(
        `/roles?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch roles");
    }
  }

  /**
   * Get single role by ID
   */
  async getRoleById(id: number): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch role");
    }
  }

  /**
   * Create new role
   */
  async createRole(roleData: CreateRoleRequest): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.post<ApiResponse<Role>>(
        "/roles",
        roleData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create role");
    }
  }

  /**
   * Update existing role
   */
  async updateRole(
    id: number,
    roleData: UpdateRoleRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.put<ApiResponse<Role>>(
        `/roles/${id}`,
        roleData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update role");
    }
  }

  /**
   * Delete role
   */
  async deleteRole(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/roles/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to delete role");
    }
  }

  /**
   * Toggle role active status
   */
  async toggleRoleStatus(id: number): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.patch<ApiResponse<Role>>(
        `/roles/${id}/toggle-status`,
        {},
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to toggle role status");
    }
  }

  /**
   * Search roles
   */
  async searchRoles(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<Role[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Role[]>>(
        `/roles/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to search roles");
    }
  }

  /**
   * Get active roles only
   */
  async getActiveRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Role[]>>(
        "/roles/active",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch active roles");
    }
  }

  /**
   * Get admin roles only
   */
  async getAdminRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Role[]>>(
        "/roles/admin",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch admin roles");
    }
  }

  /**
   * Get role statistics
   */
  async getRoleStats(): Promise<ApiResponse<RoleStats>> {
    try {
      const response = await apiClient.get<ApiResponse<RoleStats>>(
        "/roles/stats",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch role statistics");
    }
  }

  /**
   * Get role with permissions
   */
  async getRolePermissions(id: number): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.get<ApiResponse<Role>>(
        `/roles/${id}/permissions`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch role permissions");
    }
  }

  /**
   * Assign permissions to role
   */
  async assignPermissions(
    id: number,
    data: AssignPermissionsRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.post<ApiResponse<Role>>(
        `/roles/${id}/permissions`,
        data,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to assign permissions");
    }
  }

  /**
   * Remove permissions from role
   */
  async removePermissions(
    id: number,
    data: AssignPermissionsRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.delete<ApiResponse<Role>>(
        `/roles/${id}/permissions`,
        {
          data,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to remove permissions");
    }
  }

  /**
   * Get role users
   */
  async getRoleUsers(id: number): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(
        `/roles/${id}/users`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch role users");
    }
  }

  /**
   * Assign users to role
   */
  async assignUsers(
    id: number,
    data: AssignUsersRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.post<ApiResponse<Role>>(
        `/roles/${id}/users`,
        data,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to assign users");
    }
  }

  /**
   * Remove users from role
   */
  async removeUsers(
    id: number,
    data: AssignUsersRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.delete<ApiResponse<Role>>(
        `/roles/${id}/users`,
        {
          data: { user_ids: data.user_ids },
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to remove users");
    }
  }

  /**
   * Duplicate role
   */
  async duplicateRole(
    id: number,
    data: DuplicateRoleRequest
  ): Promise<ApiResponse<Role>> {
    try {
      const response = await apiClient.post<ApiResponse<Role>>(
        `/roles/${id}/duplicate`,
        data,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to duplicate role");
    }
  }
}

// Export service instance
export const roleService = new RoleService();
