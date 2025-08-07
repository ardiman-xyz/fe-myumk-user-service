import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";

import UserListHeader from "./_components/UserListHeader";
import UserListFilters from "./_components/UserListFilters";
import UserListTable from "./_components/UserListTable";
import UserListPagination from "./_components/UserListPagination";
import ResetPasswordModal from "./_components/ResetPasswordModal";
import UserDeleteModal from "./_components/UserDeleteModal";
import type { User, UserFilters } from "@/types/user";
import { userService } from "@/services/userService";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

const UserListMain: React.FC = () => {
  useTitle("Users - User Service");
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "",
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

  // Load users function
  const loadUsers = async (newFilters?: any) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const response = await userService.getUsers(currentFilters);

      if (response.success && response.data) {
        setUsers(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        toast.error(response.message || "Failed to load users");
        setUsers([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setSelectedUsers([]); // Clear selection when filters change
    loadUsers(newFilters);
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

  // Handle user selection
  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  // Handle user actions
  const handleUserAction = async (action: string, userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      switch (action) {
        case "view":
          navigate(`/users/${userId}`);
          break;

        case "edit":
          navigate(`/users/${userId}/edit`);
          break;

        case "toggle-status":
          const response = await userService.toggleUserStatus(userId);
          if (response.success) {
            toast.success(
              `User ${
                user.is_active ? "deactivated" : "activated"
              } successfully`
            );
            loadUsers(); // Reload to get updated data
          } else {
            toast.error(response.message || "Failed to update user status");
          }
          break;

        case "reset-password":
          // This would typically open a modal or navigate to reset password page
          const userToReset = users.find((u) => u.id === userId);
          if (userToReset) {
            setResetPasswordUser(userToReset);
          }
          break;

        case "delete":
          const userToDelete = users.find((u) => u.id === userId);
          if (userToDelete) {
            setDeleteUser(userToDelete);
          }
          break;

        default:
          console.log(`Action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} user`);
      console.error(`Error ${action} user:`, error);
    }
  };

  const handleResetPassword = async (userId: number, password: string) => {
    try {
      const response = await userService.resetPassword(userId, password);
      if (response.success) {
        toast.success("Password reset successfully");
        setResetPasswordUser(null);

        // Optional: Send notification to user
        toast.info("User has been notified of the password change", {
          description:
            "Make sure to securely share the new password with the user.",
        });
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to reset password");
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select users first");
      return;
    }

    try {
      switch (action) {
        case "assign-role":
          toast.info("Assign role feature coming soon");
          break;

        case "deactivate":
          if (
            window.confirm(
              `Are you sure you want to deactivate ${selectedUsers.length} users?`
            )
          ) {
            toast.info("Bulk deactivate feature coming soon");
          }
          break;

        case "export-selected":
          toast.info("Export selected users feature coming soon");
          break;

        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`
            )
          ) {
            // This would be a bulk delete API call
            toast.info("Bulk delete feature coming soon");
          }
          break;
        case "edit":
          handleBulkEdit();
          break;

        default:
          console.log(`Bulk action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} users`);
      console.error(`Error bulk ${action}:`, error);
    }
  };

  const handleBulkEdit = () => {
    navigate("/users/edit", {
      state: {
        userIds: selectedUsers,
        users: users.filter((user) => selectedUsers.includes(user.id)),
      },
    });
  };

  // Tambahkan function ini di UserListMain.tsx setelah handleResetPassword

  const handleDeleteUser = async (userId: number) => {
    try {
      // Get user info before deletion
      const userToDelete = users.find((u) => u.id === userId);
      const userName = userToDelete
        ? `${userToDelete.first_name} ${userToDelete.last_name}`
        : "User";

      // Call delete API
      const response = await userService.deleteUser(userId);

      if (response.success) {
        // Success: Show notification
        toast.success("User deleted successfully", {
          description: `${userName} has been permanently removed from the system.`,
        });

        // Close modal
        setDeleteUser(null);

        // Remove from selected users if it was selected
        setSelectedUsers((prev) => prev.filter((id) => id !== userId));

        // Update users list immediately for better UX
        setUsers((prev) => prev.filter((user) => user.id !== userId));

        // Update pagination total
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          to: prev.to > 0 ? prev.to - 1 : 0,
        }));

        // If current page becomes empty and not first page, go to previous page
        const remainingUsers = users.filter((user) => user.id !== userId);
        if (remainingUsers.length === 0 && pagination.current_page > 1) {
          const newFilters = { ...filters, page: pagination.current_page - 1 };
          handleFiltersChange(newFilters);
        }
      } else {
        // API returned error
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to delete user";
      let errorDescription = "Please try again later.";

      if (error.response?.status === 404) {
        errorMessage = "User not found";
        errorDescription = "The user may have already been deleted.";
        // Remove from UI anyway since user doesn't exist
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setDeleteUser(null);
      } else if (error.response?.status === 403) {
        errorMessage = "Permission denied";
        errorDescription = "You don't have permission to delete this user.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete user";
        errorDescription = "User has associated data that prevents deletion.";
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
    // const blob = await userService.exportUsers(filters);
    // downloadBlob(blob, 'users.csv');
  };

  return (
    <div className="space-y-6">
      <UserListHeader
        totalUsers={pagination.total}
        selectedCount={selectedUsers.length}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
      />

      <UserListFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      <UserListTable
        users={users}
        selectedUsers={selectedUsers}
        loading={loading}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onUserAction={handleUserAction}
      />

      <UserListPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        loading={loading}
      />

      <ResetPasswordModal
        user={resetPasswordUser}
        open={!!resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        onResetPassword={handleResetPassword}
      />
      <UserDeleteModal
        user={deleteUser}
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserListMain;
