import apiClient from "@/config/api";
import { tokenManager } from "@/utils/tokenManager";

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
  children?: Menu[];
  parent?: Menu;
  application?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface MenuFilters {
  search?: string;
  application_id?: number;
  parent_id?: number | string;
  status?: "active" | "inactive" | "";
  sort_by?: "sort_order" | "name" | "code" | "created_at";
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface CreateMenuRequest {
  application_id: number;
  parent_id?: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateMenuRequest {
  application_id?: number;
  parent_id?: number;
  name?: string;
  code?: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order?: number;
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

export interface MenuOrderUpdate {
  id: number;
  sort_order: number;
  parent_id?: number;
}

class MenuService {
  private async getAuthHeaders() {
    const token = await tokenManager.getValidAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get paginated list of menus
   */
  async getMenus(filters: MenuFilters = {}): Promise<ApiResponse<Menu[]>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/menus?${params.toString()}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch menus");
    }
  }

  /**
   * Get single menu by ID
   */
  async getMenuById(id: number): Promise<ApiResponse<Menu>> {
    try {
      const response = await apiClient.get<ApiResponse<Menu>>(`/menus/${id}`, {
        headers: await this.getAuthHeaders(), // ← ADD await
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch menu");
    }
  }

  /**
   * Create new menu
   */
  async createMenu(menuData: CreateMenuRequest): Promise<ApiResponse<Menu>> {
    try {
      const response = await apiClient.post<ApiResponse<Menu>>(
        "/menus",
        menuData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to create menu");
    }
  }

  /**
   * Update existing menu
   */
  async updateMenu(
    id: number,
    menuData: UpdateMenuRequest
  ): Promise<ApiResponse<Menu>> {
    try {
      const response = await apiClient.put<ApiResponse<Menu>>(
        `/menus/${id}`,
        menuData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update menu");
    }
  }

  /**
   * Delete menu
   */
  async deleteMenu(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/menus/${id}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to delete menu");
    }
  }

  /**
   * Toggle menu active status
   */
  async toggleMenuStatus(id: number): Promise<ApiResponse<Menu>> {
    try {
      const response = await apiClient.patch<ApiResponse<Menu>>(
        `/menus/${id}/toggle-status`,
        {},
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to toggle menu status");
    }
  }

  /**
   * Get menu tree structure
   */
  async getMenuTree(applicationId?: number): Promise<ApiResponse<Menu[]>> {
    try {
      const params = applicationId ? `?application_id=${applicationId}` : "";
      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/menus/tree${params}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch menu tree");
    }
  }

  /**
   * Get menus by application
   */
  async getMenusByApplication(
    applicationId: number
  ): Promise<ApiResponse<Menu[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/menus/application/${applicationId}`,
        { headers: await this.getAuthHeaders() }
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
   * Search menus
   */
  async searchMenus(
    query: string,
    limit: number = 10,
    applicationId?: number
  ): Promise<ApiResponse<Menu[]>> {
    try {
      const params = new URLSearchParams({ q: query, limit: limit.toString() });
      if (applicationId) {
        params.append("application_id", applicationId.toString());
      }

      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/menus/search?${params.toString()}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to search menus");
    }
  }

  /**
   * Get parent menu options
   */
  async getParentOptions(
    applicationId?: number,
    excludeId?: number
  ): Promise<ApiResponse<Menu[]>> {
    try {
      const params = new URLSearchParams();
      if (applicationId)
        params.append("application_id", applicationId.toString());
      if (excludeId) params.append("exclude_id", excludeId.toString());

      const response = await apiClient.get<ApiResponse<Menu[]>>(
        `/menus/parent-options?${params.toString()}`,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to fetch parent options");
    }
  }

  /**
   * Update menu order
   */
  async updateMenuOrder(menus: MenuOrderUpdate[]): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        "/menus/update-order",
        { menus },
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to update menu order");
    }
  }

  /**
   * Validate menu code availability
   */
  async checkCodeAvailability(
    code: string,
    applicationId: number,
    excludeId?: number
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const params = new URLSearchParams({
        code,
        application_id: applicationId.toString(),
      });
      if (excludeId) {
        params.append("exclude_id", excludeId.toString());
      }

      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/menus/check-code?${params.toString()}`,
        { headers: await this.getAuthHeaders() }
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
   * Export menus to various formats
   */
  async exportMenus(
    applicationId?: number,
    format: "json" | "csv" = "json"
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({ format });
      if (applicationId) {
        params.append("application_id", applicationId.toString());
      }

      const response = await apiClient.get(
        `/menus/export?${params.toString()}`,
        {
          headers: await this.getAuthHeaders(),
          responseType: "blob",
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error("Failed to export menus");
    }
  }

  /**
   * Import menus from file
   */
  /**
   * Import menus from file
   */
  async importMenus(
    file: File,
    applicationId: number
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("application_id", applicationId.toString());

      const authHeaders = await this.getAuthHeaders(); // ← GET headers first
      const response = await apiClient.post<
        ApiResponse<{ imported: number; errors: string[] }>
      >("/menus/import", formData, {
        headers: {
          ...authHeaders, // ← SPREAD the resolved headers
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to import menus");
    }
  }

  /**
   * Duplicate menu structure
   */
  async duplicateMenu(
    menuId: number,
    newData: { name: string; code: string; application_id?: number }
  ): Promise<ApiResponse<Menu>> {
    try {
      const response = await apiClient.post<ApiResponse<Menu>>(
        `/menus/${menuId}/duplicate`,
        newData,
        { headers: await this.getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error("Failed to duplicate menu");
    }
  }
}

// Export service instance
export const menuService = new MenuService();
