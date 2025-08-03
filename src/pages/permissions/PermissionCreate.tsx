// src/pages/permissions/PermissionCreate.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Key } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type {
  CreatePermissionFormData,
  CreatePermissionRequest,
} from "@/types/permission";
import { permissionService } from "@/services/permissionService";
import PermissionCrudGenerator from "./_components/PermissionCrudGenerator";
import PermissionForm from "./_components/PermissionForm";
import PermissionCreateInfo from "./_components/PermissionCreateInfo";

const PermissionCreate: React.FC = () => {
  useTitle("Add Permission - User Service");
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get URL parameters to determine mode
  const urlParams = new URLSearchParams(location.search);
  const createType = urlParams.get("type"); // 'crud', 'batch', or null for normal
  const duplicateFrom = location.state?.duplicateFrom; // For duplicating existing permission

  const [currentMode, setCurrentMode] = useState<"single" | "crud" | "batch">(
    createType === "crud" ? "crud" : createType === "batch" ? "batch" : "single"
  );

  const handleFormSubmit = async (formData: CreatePermissionFormData) => {
    console.log("Form Data:", formData);
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare data for API
      const apiData: CreatePermissionRequest = {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        resource: formData.resource,
        action: formData.action,
      };

      // Call API
      const response = await permissionService.createPermission(apiData);

      if (response.success && response.data) {
        setSuccessMessage(
          `Permission "${response.data.name}" created successfully!`
        );

        // Show success toast
        toast.success("Permission created successfully!", {
          description: `${response.data.name} has been added to the system.`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/permissions");
        }, 1000);
      } else {
        // Handle API errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setErrorMessage(errorMessages.join(", "));
        } else {
          setErrorMessage(response.message || "Failed to create permission");
        }

        toast.error("Failed to create permission", {
          description:
            response.message || "Please check the form and try again.",
        });
      }
    } catch (error: any) {
      console.error("Error creating permission:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error creating permission", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrudGenerate = async (
    resource: string,
    resourceDisplayName: string
  ) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await permissionService.generateCrudPermissions(
        resource,
        resourceDisplayName
      );

      if (response.success && response.data) {
        const createdCount = response.data.length;
        setSuccessMessage(
          `Successfully generated ${createdCount} CRUD permissions for ${resourceDisplayName}!`
        );

        toast.success("CRUD permissions generated!", {
          description: `${createdCount} permissions created for ${resourceDisplayName}.`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/permissions");
        }, 1500);
      } else {
        setErrorMessage(
          response.message || "Failed to generate CRUD permissions"
        );
        toast.error("Failed to generate permissions", {
          description: response.message || "Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error generating CRUD permissions:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error generating permissions", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "single-permission":
        setCurrentMode("single");
        break;
      case "crud-generator":
        setCurrentMode("crud");
        break;
      case "batch-create":
        setCurrentMode("batch");
        toast.info("Feature coming soon", {
          description: "Batch permission creation will be available soon.",
        });
        break;
      case "import-template":
        toast.info("Feature coming soon", {
          description:
            "Import permission template feature will be available soon.",
        });
        break;
      default:
        break;
    }
  };

  const getModeTitle = () => {
    switch (currentMode) {
      case "crud":
        return "Generate CRUD Permissions";
      case "batch":
        return "Batch Create Permissions";
      default:
        return "Add New Permission";
    }
  };

  const getModeDescription = () => {
    switch (currentMode) {
      case "crud":
        return "Generate standard CRUD permissions (Create, Read, Update, Delete) for a resource";
      case "batch":
        return "Create multiple permissions at once using templates or patterns";
      default:
        return "Create a new permission with custom access controls";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/permissions"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Permissions
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Key className="h-6 w-6 text-orange-600" />
              {getModeTitle()}
            </h1>
            <p className="text-sm text-gray-600">{getModeDescription()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/permissions")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      {!createType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">
            Creation Mode
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={currentMode === "single" ? "default" : "outline"}
              onClick={() => setCurrentMode("single")}
              className="h-auto p-3 text-left"
              disabled={isLoading}
            >
              <div>
                <div className="font-medium">Single Permission</div>
                <div className="text-xs text-gray-500">
                  Create one custom permission
                </div>
              </div>
            </Button>
            <Button
              variant={currentMode === "crud" ? "default" : "outline"}
              onClick={() => setCurrentMode("crud")}
              className="h-auto p-3 text-left"
              disabled={isLoading}
            >
              <div>
                <div className="font-medium">CRUD Generator</div>
                <div className="text-xs text-gray-500">
                  Generate view, create, edit, delete
                </div>
              </div>
            </Button>
            <Button
              variant={currentMode === "batch" ? "default" : "outline"}
              onClick={() => setCurrentMode("batch")}
              className="h-auto p-3 text-left"
              disabled={isLoading}
            >
              <div>
                <div className="font-medium">Batch Create</div>
                <div className="text-xs text-gray-500">
                  Create multiple at once
                </div>
              </div>
            </Button>
          </div>
        </div>
      )}

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
          {currentMode === "crud" ? (
            <PermissionCrudGenerator
              onGenerate={handleCrudGenerate}
              isLoading={isLoading}
            />
          ) : currentMode === "batch" ? (
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center py-8">
                <Key className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Batch Create Coming Soon
                </h3>
                <p className="text-sm text-gray-600">
                  This feature will allow you to create multiple permissions at
                  once.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentMode("single")}
                  className="mt-4"
                >
                  Create Single Permission Instead
                </Button>
              </div>
            </div>
          ) : (
            <PermissionForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              mode="create"
              initialData={
                duplicateFrom
                  ? {
                      name: `Copy of ${duplicateFrom.name}`,
                      code: `${duplicateFrom.code}_copy`,
                      description: duplicateFrom.description,
                      resource: duplicateFrom.resource,
                      action: duplicateFrom.action,
                    }
                  : undefined
              }
            />
          )}
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <PermissionCreateInfo
            onQuickAction={handleQuickAction}
            currentMode={currentMode}
          />
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
            <span className="text-gray-900 font-medium">
              {currentMode === "crud"
                ? "Generating permissions..."
                : "Creating permission..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionCreate;
