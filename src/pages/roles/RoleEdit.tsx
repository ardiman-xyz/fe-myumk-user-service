import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Loader,
  Eye,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type { UpdateRoleRequest, Role } from "@/types/role";

import { roleService } from "@/services/roleService";
import RoleUpdateInfo from "./_components/RoleUpdateInfo";
import type {
  ApplicationWithChecked,
  RoleEditFormData,
} from "@/types/roleEditTypes";
import { roleEditService } from "@/services/roleEditService";
import RoleEditForm from "./_components/RoleEditForm";

const RoleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roleId = id ? parseInt(id, 10) : null;

  useTitle("Edit Role - User Service");
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [availableApplications, setAvailableApplications] = useState<
    ApplicationWithChecked[]
  >([]);

  const [formData, setFormData] = useState<RoleEditFormData>({
    name: "",
    code: "",
    description: "",
    is_admin: false,
    is_active: true,
    applications: [],
    permissions: [],
  });

  // Load role data on mount
  useEffect(() => {
    if (!roleId) {
      setErrorMessage("Invalid role ID");
      setLoading(false);
      return;
    }

    loadRole();
  }, [roleId]);

  const loadRole = async () => {
    if (!roleId) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await roleEditService.getRoleForEdit(roleId);

      if (response.success && response.data) {
        const { role: roleData, available_applications } = response.data;

        // Set role basic info
        setRole(roleData);

        // Set available applications (sudah ada is_checked dari backend)
        setAvailableApplications(available_applications);

        // Set form data dengan nilai dari role
        setFormData({
          name: roleData.name,
          description: roleData.description || "",
          is_admin: roleData.is_admin,
          is_active: roleData.is_active,
          code: roleData.code,
          // Extract selected IDs dari applications yang is_checked = true
          applications: available_applications
            .filter((app) => app.is_checked)
            .map((app) => app.id),
          // Extract selected permission IDs dari semua permission yang is_checked = true
          permissions: available_applications.flatMap((app) => [
            ...app.permissions
              .filter((perm) => perm.is_checked)
              .map((perm) => perm.id),
            ...app.menus.flatMap((menu) =>
              menu.permissions
                .filter((perm) => perm.is_checked)
                .map((perm) => perm.id)
            ),
          ]),
        });
      } else {
        setErrorMessage(response.message || "Failed to load role");
      }
    } catch (error: any) {
      console.error("Error loading role:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (field: keyof RoleEditFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplicationsChange = (applications: number[]) => {
    setFormData((prev) => ({
      ...prev,
      applications,
    }));
  };
  const handleFormSubmit = async (formData: RoleEditFormData) => {
    if (!roleId || !role) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare data for API - exclude code as it's not editable
      const apiData: UpdateRoleRequest = {
        name: formData.name,
        description: formData.description || undefined,
        is_admin: formData.is_admin,
        is_active: formData.is_active,
        permissions:
          formData.permissions && formData.permissions.length > 0
            ? formData.permissions
            : undefined,
        applications:
          formData.applications && formData.applications.length > 0
            ? formData.applications
            : undefined,
      };

      // Call API
      const response = await roleService.updateRole(roleId, apiData);

      if (response.success && response.data) {
        setSuccessMessage(`Role "${response.data.name}" updated successfully!`);
        setRole(response.data); // Update local role data

        // Show success toast
        toast.success("Role updated successfully!", {
          description: `${response.data.name} has been updated.`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/roles");
        }, 1000);
      } else {
        // Handle API errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setErrorMessage(errorMessages.join(", "));
        } else {
          setErrorMessage(response.message || "Failed to update role");
        }

        toast.error("Failed to update role", {
          description:
            response.message || "Please check the form and try again.",
        });
      }
    } catch (error: any) {
      console.error("Error updating role:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error updating role", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    if (!role) return;

    switch (actionId) {
      case "view-details":
        navigate(`/roles/${role.id}`);
        break;
      case "manage-permissions":
        navigate(`/roles/${role.id}/permissions`);
        break;
      case "manage-users":
        navigate(`/roles/${role.id}/users`);
        break;
      case "duplicate-role":
        navigate(`/roles/${role.id}/duplicate`);
        break;
      case "role-history":
        toast.info("Feature coming soon", {
          description: "Role change history will be available soon.",
        });
        break;
      case "export-role":
        toast.info("Feature coming soon", {
          description:
            "Export role configuration feature will be available soon.",
        });
        break;
      default:
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
          <span className="text-lg text-gray-600">Loading role...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!role && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/roles"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Roles
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Role Not Found
              </h1>
            </div>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            The requested role could not be found.
          </p>
          <Link to="/roles">
            <Button>Return to Roles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/roles"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Roles
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Edit Role
            </h1>
            <p className="text-sm text-gray-600">
              Update role "{role?.name}" configuration and permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/roles/${role?.id}`)}
            disabled={isSubmitting}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/roles")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <RoleEditForm
            availableApplications={availableApplications}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
            formData={formData}
            onPermissionsChange={(permissions: number[]) => {
              setFormData((prev) => ({
                ...prev,
                permissions,
              }));
            }}
            onFormDataChange={handleFormDataChange}
            onApplicationsChange={handleApplicationsChange}
          />
        </div>

        {/* Role Update Info Section */}
        <div className="lg:col-span-1">
          <RoleUpdateInfo role={role} />
        </div>
      </div>

      {/* Progress Indicator */}
      {isSubmitting && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader className="animate-spin h-6 w-6" />
            <span className="text-gray-600">Updating role...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleEditPage;
