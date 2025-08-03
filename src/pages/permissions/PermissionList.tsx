import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type { Permission, PermissionFilters } from "@/types/permission";
import { permissionService } from "@/services/permissionService";
import PermissionListHeader from "./_components/PermissionListHeader";
import PermissionListFilters from "./_components/PermissionListFilters";
import PermissionListTable from "./_components/PermissionListTable";
import PermissionDeleteModal from "./_components/PermissionDeleteModal";
import PermissionListPagination from "./_components/PermissionListPagination";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

const PermissionList: React.FC = () => {
  useTitle("Permissions - User Service");
  const navigate = useNavigate();

  // State management
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [deletePermission, setDeletePermission] = useState<Permission | null>(
    null
  );
  const [filters, setFilters] = useState<PermissionFilters>({
    search: "",
    resource: "",
    action: "",
    sort_by: "created_at",
    sort_order: "desc",
    per_page: 15,
    page: 1,
  });
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
    has_more_pages: false,
  });

  // Load permissions function
  const loadPermissions = async (newFilters?: PermissionFilters) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const response = await permissionService.getPermissions(currentFilters);

      if (response.success && response.data) {
        setPermissions(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        toast.error(response.message || "Failed to load permissions");
        setPermissions([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load permissions");
      console.error("Error loading permissions:", error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPermissions();
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters: PermissionFilters) => {
    setFilters(newFilters);
    setSelectedPermissions([]); // Clear selection when filters change
    loadPermissions(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    handleFiltersChange(newFilters);
  };

  const handlePerPageChange = (perPage: number) => {
    const newFilters = { ...filters, per_page: perPage, page: 1 };
    handleFiltersChange(newFilters);
  };

  // Handle permission selection
  const handleSelectPermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((permission) => permission.id));
    }
  };

  // Handle permission actions
  const handlePermissionAction = async (
    action: string,
    permissionId: number
  ) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (!permission) return;

    try {
      switch (action) {
        case "view":
          navigate(`/permissions/${permissionId}`);
          break;

        case "edit":
          navigate(`/permissions/${permissionId}/edit`);
          break;

        case "duplicate":
          navigate(`/permissions/create`, {
            state: { duplicateFrom: permission },
          });
          break;

        case "delete":
          const permissionToDelete = permissions.find(
            (p) => p.id === permissionId
          );
          if (permissionToDelete) {
            setDeletePermission(permissionToDelete);
          }
          break;

        default:
          console.log(`Action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} permission`);
      console.error(`Error ${action} permission:`, error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedPermissions.length === 0) {
      toast.warning("Please select permissions first");
      return;
    }

    try {
      switch (action) {
        case "export-selected":
          toast.info("Export selected permissions feature coming soon");
          break;

        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedPermissions.length} permissions? This action cannot be undone.`
            )
          ) {
            toast.info("Bulk delete feature coming soon");
          }
          break;

        default:
          console.log(`Bulk action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} permissions`);
      console.error(`Error bulk ${action}:`, error);
    }
  };

  // Handle delete permission
  const handleDeletePermission = async (permissionId: number) => {
    try {
      // Get permission info before deletion
      const permissionToDelete = permissions.find((p) => p.id === permissionId);
      const permissionName = permissionToDelete
        ? permissionToDelete.name
        : "Permission";

      // Call delete API
      const response = await permissionService.deletePermission(permissionId);

      if (response.success) {
        // Success: Show notification
        toast.success("Permission deleted successfully", {
          description: `${permissionName} has been permanently removed from the system.`,
        });

        // Close modal
        setDeletePermission(null);

        // Remove from selected permissions if it was selected
        setSelectedPermissions((prev) =>
          prev.filter((id) => id !== permissionId)
        );

        // Update permissions list immediately for better UX
        setPermissions((prev) =>
          prev.filter((permission) => permission.id !== permissionId)
        );

        // Update pagination total
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          to: prev.to > 0 ? prev.to - 1 : 0,
        }));

        // If current page becomes empty and not first page, go to previous page
        const remainingPermissions = permissions.filter(
          (permission) => permission.id !== permissionId
        );
        if (remainingPermissions.length === 0 && pagination.current_page > 1) {
          const newFilters = { ...filters, page: pagination.current_page - 1 };
          handleFiltersChange(newFilters);
        }
      } else {
        // API returned error
        throw new Error(response.message || "Failed to delete permission");
      }
    } catch (error: any) {
      console.error("Error deleting permission:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to delete permission";
      let errorDescription = "Please try again later.";

      if (error.response?.status === 404) {
        errorMessage = "Permission not found";
        errorDescription = "The permission may have already been deleted.";
        // Remove from UI anyway since permission doesn't exist
        setPermissions((prev) =>
          prev.filter((permission) => permission.id !== permissionId)
        );
        setDeletePermission(null);
      } else if (error.response?.status === 403) {
        errorMessage = "Permission denied";
        errorDescription =
          "You don't have permission to delete this permission.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete permission";
        errorDescription =
          "Permission is assigned to roles that prevents deletion.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
      });

      // Re-throw error for modal to handle
      throw new Error(errorMessage);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await permissionService.exportPermissions(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `permissions-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Permissions exported successfully");
    } catch (error: any) {
      toast.error("Failed to export permissions");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Component */}
      <PermissionListHeader
        totalPermissions={pagination.total}
        selectedCount={selectedPermissions.length}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
      />

      {/* Filters Component */}
      <PermissionListFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Table Component */}
      <PermissionListTable
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        loading={loading}
        onSelectPermission={handleSelectPermission}
        onSelectAll={handleSelectAll}
        onPermissionAction={handlePermissionAction}
      />

      {/* Pagination Component */}
      <PermissionListPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        loading={loading}
      />

      {/* Delete Modal */}
      <PermissionDeleteModal
        permission={deletePermission}
        open={!!deletePermission}
        onClose={() => setDeletePermission(null)}
        onDeletePermission={handleDeletePermission}
      />
    </div>
  );
};

export default PermissionList;
