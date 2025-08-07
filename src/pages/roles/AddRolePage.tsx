import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Loader,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type { CreateRoleFormData, CreateRoleRequest } from "@/types/role";

import { roleService } from "@/services/roleService";
import RoleForm from "./_components/RoleForm";
import RoleCreateInfo from "./_components/RoleCreateInfo";

const AddRolePage: React.FC = () => {
  useTitle("Add Role - User Service");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (formData: CreateRoleFormData) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare data for API
      const apiData: CreateRoleRequest = {
        name: formData.name,
        code: formData.code,
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
      const response = await roleService.createRole(apiData);

      if (response.success && response.data) {
        setSuccessMessage(`Role "${response.data.name}" created successfully!`);

        // Show success toast
        toast.success("Role created successfully!", {
          description: `${response.data.name} has been added to the system.`,
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
          setErrorMessage(response.message || "Failed to create role");
        }

        toast.error("Failed to create role", {
          description:
            response.message || "Please check the form and try again.",
        });
      }
    } catch (error: any) {
      console.error("Error creating role:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error creating role", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "create-with-permissions":
        toast.info("Feature coming soon", {
          description:
            "Create with Permissions template will be available soon.",
        });
        break;
      case "duplicate-existing":
        navigate("/roles", {
          state: { action: "duplicate" },
        });
        break;
      case "import-template":
        toast.info("Feature coming soon", {
          description: "Import role template feature will be available soon.",
        });
        break;
      case "role-templates":
        toast.info("Feature coming soon", {
          description: "Pre-defined role templates will be available soon.",
        });
        break;
      default:
        break;
    }
  };

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
              Add New Role
            </h1>
            <p className="text-sm text-gray-600">
              Create a new role with permissions and access controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/roles")}
            disabled={isLoading}
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
          <RoleForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            mode="create"
          />
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <RoleCreateInfo onQuickAction={handleQuickAction} />
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader className="animate-spin h-6 w-6" />
            <span className="text-gray-600">Loading permission...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRolePage;
