import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type { Application, ApplicationFilters } from "@/types/application";
import { applicationService } from "@/services/applicationService";
import ApplicationListHeader from "./_components/ApplicationListHeader";
import ApplicationListFilters from "./_components/ApplicationListFilters";
import ApplicationListTable from "./_components/ApplicationListTable";
import ApplicationListPagination from "./_components/ApplicationListPagination";
import ApplicationDeleteModal from "./_components/ApplicationDeleteModal";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

const ApplicationsList: React.FC = () => {
  useTitle("Applications - User Service");
  const navigate = useNavigate();

  // State management
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState<number[]>(
    []
  );
  const [deleteApplication, setDeleteApplication] =
    useState<Application | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({
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

  // Load applications function
  const loadApplications = async (newFilters?: ApplicationFilters) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const response = await applicationService.getApplications(currentFilters);

      if (response.success && response.data) {
        setApplications(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        toast.error(response.message || "Failed to load applications");
        setApplications([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load applications");
      console.error("Error loading applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadApplications();
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters: ApplicationFilters) => {
    setFilters(newFilters);
    setSelectedApplications([]); // Clear selection when filters change
    loadApplications(newFilters);
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

  // Handle application selection
  const handleSelectApplication = (applicationId: number) => {
    setSelectedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app.id));
    }
  };

  // Handle application actions
  const handleApplicationAction = async (
    action: string,
    applicationId: number
  ) => {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;

    try {
      switch (action) {
        case "view":
          navigate(`/applications/${applicationId}`);
          break;

        case "edit":
          navigate(`/applications/${applicationId}/edit`);
          break;

        case "toggle-status":
          const response = await applicationService.toggleApplicationStatus(
            applicationId
          );
          if (response.success) {
            toast.success(
              `Application ${
                application.is_active ? "deactivated" : "activated"
              } successfully`
            );
            loadApplications(); // Reload to get updated data
          } else {
            toast.error(
              response.message || "Failed to update application status"
            );
          }
          break;

        case "roles":
          navigate(`/applications/${applicationId}/roles`);
          break;

        case "menus":
          navigate(`/applications/${applicationId}/menus`);
          break;

        case "duplicate":
          navigate(`/applications/${applicationId}/duplicate`);
          break;

        case "open":
          if (application.url) {
            window.open(application.url, "_blank");
          } else {
            toast.info("No URL configured for this application");
          }
          break;

        case "delete":
          const appToDelete = applications.find(
            (app) => app.id === applicationId
          );
          if (appToDelete) {
            setDeleteApplication(appToDelete);
          }
          break;

        default:
          console.log(`Action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} application`);
      console.error(`Error ${action} application:`, error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedApplications.length === 0) {
      toast.warning("Please select applications first");
      return;
    }

    try {
      switch (action) {
        case "activate":
          if (
            window.confirm(
              `Are you sure you want to activate ${selectedApplications.length} applications?`
            )
          ) {
            toast.info("Bulk activate feature coming soon");
          }
          break;

        case "deactivate":
          if (
            window.confirm(
              `Are you sure you want to deactivate ${selectedApplications.length} applications?`
            )
          ) {
            toast.info("Bulk deactivate feature coming soon");
          }
          break;

        case "export-selected":
          toast.info("Export selected applications feature coming soon");
          break;

        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedApplications.length} applications? This action cannot be undone.`
            )
          ) {
            toast.info("Bulk delete feature coming soon");
          }
          break;

        default:
          console.log(`Bulk action ${action} not implemented yet`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} applications`);
      console.error(`Error bulk ${action}:`, error);
    }
  };

  // Handle delete application
  const handleDeleteApplication = async (applicationId: number) => {
    try {
      // Get application info before deletion
      const appToDelete = applications.find((app) => app.id === applicationId);
      const appName = appToDelete ? appToDelete.name : "Application";

      // Call delete API
      const response = await applicationService.deleteApplication(
        applicationId
      );

      if (response.success) {
        // Success: Show notification
        toast.success("Application deleted successfully", {
          description: `${appName} has been permanently removed from the system.`,
        });

        // Close modal
        setDeleteApplication(null);

        // Remove from selected applications if it was selected
        setSelectedApplications((prev) =>
          prev.filter((id) => id !== applicationId)
        );

        // Update applications list immediately for better UX
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );

        // Update pagination total
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          to: prev.to > 0 ? prev.to - 1 : 0,
        }));

        // If current page becomes empty and not first page, go to previous page
        const remainingApplications = applications.filter(
          (app) => app.id !== applicationId
        );
        if (remainingApplications.length === 0 && pagination.current_page > 1) {
          const newFilters = { ...filters, page: pagination.current_page - 1 };
          handleFiltersChange(newFilters);
        }
      } else {
        // API returned error
        throw new Error(response.message || "Failed to delete application");
      }
    } catch (error: any) {
      console.error("Error deleting application:", error);

      // Handle different error scenarios
      let errorMessage = "Failed to delete application";
      let errorDescription = "Please try again later.";

      if (error.response?.status === 404) {
        errorMessage = "Application not found";
        errorDescription = "The application may have already been deleted.";
        // Remove from UI anyway since application doesn't exist
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        setDeleteApplication(null);
      } else if (error.response?.status === 403) {
        errorMessage = "Permission denied";
        errorDescription =
          "You don't have permission to delete this application.";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete application";
        errorDescription =
          "Application has associated data that prevents deletion.";
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
    // toast.info("Export feature coming soon");
    // // This would typically trigger a download
    // // const blob = await applicationService.exportApplications(filters);
    // // downloadBlob(blob, 'applications.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header Component */}
      <ApplicationListHeader
        totalApplications={pagination.total}
        selectedCount={selectedApplications.length}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
      />

      {/* Filters Component */}
      <ApplicationListFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {/* Table Component */}
      <ApplicationListTable
        applications={applications}
        selectedApplications={selectedApplications}
        loading={loading}
        onSelectApplication={handleSelectApplication}
        onSelectAll={handleSelectAll}
        onApplicationAction={handleApplicationAction}
      />

      {/* Pagination Component */}
      <ApplicationListPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        loading={loading}
      />

      {/* Delete Modal */}
      <ApplicationDeleteModal
        application={deleteApplication}
        open={!!deleteApplication}
        onClose={() => setDeleteApplication(null)}
        onDeleteApplication={handleDeleteApplication}
      />
    </div>
  );
};

export default ApplicationsList;
