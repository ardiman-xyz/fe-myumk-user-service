import apiClient from "@/config/api";

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
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

class PermissionService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token-user-service");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get paginated list of permissions
   */
  async getPermissions(
    filters: PermissionFilters = {}
  ): Promise<ApiResponse<Permission[]>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Permission[]>>(
        `/permissions?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch permissions");
    }
  }

  /**
   * Get single permission by ID
   */
  async getPermissionById(id: number): Promise<ApiResponse<Permission>> {
    try {
      const response = await apiClient.get<ApiResponse<Permission>>(
        `/permissions/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch permission");
    }
  }

  /**
   * Create new permission
   */
  async createPermission(
    permissionData: CreatePermissionRequest
  ): Promise<ApiResponse<Permission>> {
    try {
      const response = await apiClient.post<ApiResponse<Permission>>(
        "/permissions",
        permissionData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create permission");
    }
  }

  /**
   * Update existing permission
   */
  async updatePermission(
    id: number,
    permissionData: UpdatePermissionRequest
  ): Promise<ApiResponse<Permission>> {
    try {
      const response = await apiClient.put<ApiResponse<Permission>>(
        `/permissions/${id}`,
        permissionData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update permission");
    }
  }

  /**
   * Delete permission
   */
  async deletePermission(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/permissions/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to delete permission");
    }
  }

  /**
   * Search permissions
   */
  async searchPermissions(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Permission[]>>(
        `/permissions/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to search permissions");
    }
  }

  /**
   * Get permissions by resource
   */
  async getPermissionsByResource(
    resource: string
  ): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Permission[]>>(
        `/permissions/resource/${resource}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch permissions by resource");
    }
  }

  /**
   * Get permissions by action
   */
  async getPermissionsByAction(
    action: string
  ): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Permission[]>>(
        `/permissions/action/${action}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch permissions by action");
    }
  }

  /**
   * Get permission statistics
   */
  async getPermissionStats(): Promise<ApiResponse<PermissionStats>> {
    try {
      const response = await apiClient.get<ApiResponse<PermissionStats>>(
        "/permissions/stats",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch permission statistics");
    }
  }

  /**
   * Get all unique resources
   */
  async getUniqueResources(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        "/permissions/resources",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch resources");
    }
  }

  /**
   * Get all unique actions
   */
  async getUniqueActions(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        "/permissions/actions",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch actions");
    }
  }

  /**
   * Check permission code availability
   */
  async checkCodeAvailability(
    code: string,
    excludeId?: number
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const params = new URLSearchParams({ code });
      if (excludeId) {
        params.append("exclude_id", excludeId.toString());
      }

      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/permissions/check-code?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to check code availability");
    }
  }

  /**
   * Generate CRUD permissions for resource
   */
  async generateCrudPermissions(
    resource: string,
    resourceDisplayName: string
  ): Promise<ApiResponse<Permission[]>> {
    try {
      const response = await apiClient.post<ApiResponse<Permission[]>>(
        "/permissions/generate-crud",
        { resource, resource_display_name: resourceDisplayName },
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to generate CRUD permissions");
    }
  }

  /**
   * Export permissions to CSV
   */
  async exportPermissions(filters: PermissionFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(
        `/permissions/export?${params.toString()}`,
        {
          headers: this.getAuthHeaders(),
          responseType: "blob",
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error("Failed to export permissions");
    }
  }

  /**
   * Import permissions from CSV
   */
  async importPermissions(
    file: File
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<
        ApiResponse<{ imported: number; errors: string[] }>
      >("/permissions/import", formData, {
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to import permissions");
    }
  }
}

// Export service instance
export const permissionService = new PermissionService();
