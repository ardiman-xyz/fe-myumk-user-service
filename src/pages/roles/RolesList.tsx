import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type { Role, RoleFilters } from "@/types/role";
import { roleService } from "@/services/roleService";
import RoleListHeader from "./_components/RoleListHeader";
import RoleListFilters from "./_components/RoleListFilters";
import RoleListTable from "./_components/RoleListTable";
import RoleListPagination from "./_components/RoleListPagination";
import RoleDeleteModal from "./_components/RoleDeleteModal";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

const RolesList: React.FC = () => {
  useTitle("Roles - User Service");
  const navigate = useNavigate();

  // State management
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [filters, setFilters] = useState<RoleFilters>({
    search: "",
    status: "",
    is_admin: "",
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

  // Load roles function
  const loadRoles = async (newFilters?: RoleFilters) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const response = await roleService.getRoles(currentFilters);

      if (response.success && response.data) {
        setRoles(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        toast.error(response.message || "Failed to load roles");
        setRoles([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load roles");
      console.error("Error loading roles:", error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRoles();
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters: RoleFilters) => {
    setFilters(newFilters);
    setSelectedRoles([]); // Clear selection when filters change
    loadRoles(newFilters);
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

  // Handle role selection
  const handleSelectRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map((role) => role.id));
    }
  };

  // Handle role actions
  const handleRoleAction = async (action: string, roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    try {
      switch (action) {
        case "view":
          navigate(`/roles/${roleId}`);
          break;

        case "edit":
          navigate(`/roles/${roleId}/edit`);
          break;

        case "toggle-status":
          const response = await roleService.toggleRoleStatus(roleId);
          if (response.success) {
            toast.success(
              `Role ${
                role.is_active ? "deactivated" : "activated"
              } successfully`
            );
            loadRoles(); // Reload to get updated data
          } else {
            toast.error(response.message || "Failed to update role status");
          }
          break;

        case "permissions":
          navigate(`/roles/${roleId}/permissions`);
          break;

        case "users":
          navigate(`/roles/${roleId}/users`);
          break;

        case "duplicate":
          navigate(`/roles/${roleId}/duplicate`);
          break;

        case "delete":
          const roleToDelete = roles.find((r) => r.id === roleId);
          if (roleToDelete) {
            setDeleteRole(roleToDelete);
          }
          break;

        default:
          console.log(`Action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} role`);
      console.error(`Error ${action} role:`, error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedRoles.length === 0) {
      toast.warning("Please select roles first");
      return;
    }

    try {
      switch (action) {
        case "activate":
          if (
            window.confirm(
              `Are you sure you want to activate ${selectedRoles.length} roles?`
            )
          ) {
            toast.info("Bulk activate feature coming soon");
          }
          break;

        case "deactivate":
          if (
            window.confirm(
              `Are you sure you want to deactivate ${selectedRoles.length} roles?`
            )
          ) {
            toast.info("Bulk deactivate feature coming soon");
          }
          break;

        case "export-selected":
          break;

        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedRoles.length} roles? This action cannot be undone.`
            )
          ) {
            toast.info("Bulk delete feature coming soon");
          }
          break;

        default:
          console.log(`Bulk action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} roles`);
      console.error(`Error bulk ${action}:`, error);
    }
  };

  // Handle delete role
  const handleDeleteRole = async (roleId: number) => {
    try {
      // Get role info before deletion
      const roleToDelete = roles.find((r) => r.id === roleId);
      const roleName = roleToDelete ? roleToDelete.name : "Role";

      // Call delete API
      const response = await roleService.deleteRole(roleId);

      if (response.success) {
        // Success: Show notification
        toast.success("Role deleted successfully", {
          description: `${roleName} has been permanently removed from the system.`,
        });

        // Close modal
        setDeleteRole(null);

        setSelectedRoles((prev) => prev.filter((id) => id !== roleId));

        // Update roles list immediately for better UX
        setRoles((prev) => prev.filter((role) => role.id !== roleId));

        // Update pagination total
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          to: prev.to > 0 ? prev.to - 1 : 0,
        }));

        // If current page becomes empty and not first page, go to previous page
        const remainingRoles = roles.filter((role) => role.id !== roleId);
        if (remainingRoles.length === 0 && pagination.current_page > 1) {
          const newFilters = { ...filters, page: pagination.current_page - 1 };
          handleFiltersChange(newFilters);
        }
      } else {
        // API returned error
        throw new Error(response.message || "Failed to delete role");
      }
    } catch (error: any) {
      console.error("Error deleting role:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to delete role";
      let errorDescription = "Please try again later.";

      if (error.response?.status === 404) {
        errorMessage = "Role not found";
        errorDescription = "The role may have already been deleted.";
        // Remove from UI anyway since role doesn't exist
        setRoles((prev) => prev.filter((role) => role.id !== roleId));
        setDeleteRole(null);
      } else if (error.response?.status === 403) {
        errorMessage = "Permission denied";
        errorDescription = "You don't have permission to delete this role.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete role";
        errorDescription = "Role has associated users that prevents deletion.";
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
  const handleExport = () => {
    toast.info("Export feature coming soon");
    // This would typically trigger a download
    // const blob = await roleService.exportRoles(filters);
    // downloadBlob(blob, 'roles.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header Component */}
      <RoleListHeader
        totalRoles={pagination.total}
        selectedCount={selectedRoles.length}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
      />

      {/* Filters Component */}
      <RoleListFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Table Component */}
      <RoleListTable
        roles={roles}
        selectedRoles={selectedRoles}
        loading={loading}
        onSelectRole={handleSelectRole}
        onSelectAll={handleSelectAll}
        onRoleAction={handleRoleAction}
      />

      {/* Pagination Component */}
      <RoleListPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        loading={loading}
      />

      {/* Delete Modal */}
      <RoleDeleteModal
        role={deleteRole}
        open={!!deleteRole}
        onClose={() => setDeleteRole(null)}
        onDeleteRole={handleDeleteRole}
      />
    </div>
  );
};

export default RolesList;
