import apiClient from "@/config/api";
import type {
  Application,
  ApplicationFilters,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApiResponse,
  ApplicationStats,
  AssignRolesRequest,
  DuplicateApplicationRequest,
  Role,
  Menu,
} from "@/types/application";

class ApplicationService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token-user-service");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get paginated list of applications
   */
  async getApplications(
    filters: ApplicationFilters = {}
  ): Promise<ApiResponse<Application[]>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Application[]>>(
        `/applications?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch applications");
    }
  }

  /**
   * Get single application by ID
   */
  async getApplicationById(id: number): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.get<ApiResponse<Application>>(
        `/applications/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch application");
    }
  }

  /**
   * Create new application
   */
  async createApplication(
    applicationData: CreateApplicationRequest
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.post<ApiResponse<Application>>(
        "/applications",
        applicationData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create application");
    }
  }

  /**
   * Update existing application
   */
  async updateApplication(
    id: number,
    applicationData: UpdateApplicationRequest
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.put<ApiResponse<Application>>(
        `/applications/${id}`,
        applicationData,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update application");
    }
  }

  /**
   * Delete application
   */
  async deleteApplication(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/applications/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to delete application");
    }
  }

  /**
   * Toggle application active status
   */
  async toggleApplicationStatus(id: number): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.patch<ApiResponse<Application>>(
        `/applications/${id}/toggle-status`,
        {},
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to toggle application status");
    }
  }

  /**
   * Search applications
   */
  async searchApplications(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<Application[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Application[]>>(
        `/applications/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to search applications");
    }
  }

  /**
   * Get active applications only
   */
  async getActiveApplications(): Promise<ApiResponse<Application[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Application[]>>(
        "/applications/active",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch active applications");
    }
  }

  /**
   * Get active applications and permissions
   */
  async getActiveApplicationsAndPermission(): Promise<
    ApiResponse<Application[]>
  > {
    try {
      const response = await apiClient.get<ApiResponse<Application[]>>(
        "/applications/active-permission",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch active applications");
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(): Promise<ApiResponse<ApplicationStats>> {
    try {
      const response = await apiClient.get<ApiResponse<ApplicationStats>>(
        "/applications/stats",
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch application statistics");
    }
  }

  /**
   * Get application with roles
   */
  async getApplicationRoles(id: number): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.get<ApiResponse<Application>>(
        `/applications/${id}/roles`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch application roles");
    }
  }

  /**
   * Assign roles to application
   */
  async assignRoles(
    id: number,
    data: AssignRolesRequest
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.post<ApiResponse<Application>>(
        `/applications/${id}/roles`,
        data,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to assign roles");
    }
  }

  /**
   * Remove roles from application
   */
  async removeRoles(
    id: number,
    data: AssignRolesRequest
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.delete<ApiResponse<Application>>(
        `/applications/${id}/roles`,
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
      throw new Error("Failed to remove roles");
    }
  }

  /**
   * Get application menus
   */
  async getApplicationMenus(id: number): Promise<ApiResponse<Menu[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/applications/${id}/menus`,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch application menus");
    }
  }

  /**
   * Check application code availability
   */
  async checkCodeAvailability(
    code: string,
    excludeId?: number
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const params = new URLSearchParams({ code });
      if (excludeId) {
        params.append("id", excludeId.toString());
      }

      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/applications/check-code?${params.toString()}`,
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
   * Duplicate application
   */
  async duplicateApplication(
    id: number,
    data: DuplicateApplicationRequest
  ): Promise<ApiResponse<Application>> {
    try {
      const response = await apiClient.post<ApiResponse<Application>>(
        `/applications/${id}/duplicate`,
        data,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to duplicate application");
    }
  }
}

// Export service instance
export const applicationService = new ApplicationService();
