import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type {
  CreateApplicationFormData,
  UpdateApplicationRequest,
  Application,
} from "@/types/application";

import { applicationService } from "@/services/applicationService";
import ApplicationForm from "./_components/ApplicationForm";
import ApplicationCreateInfo from "./_components/ApplicationCreateInfo";

const ApplicationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useTitle("Edit Application - User Service");

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load application data
  useEffect(() => {
    const loadApplication = async () => {
      if (!id) {
        navigate("/applications");
        return;
      }

      setIsLoadingData(true);
      try {
        const response = await applicationService.getApplicationById(
          parseInt(id)
        );

        if (response.success && response.data) {
          setApplication(response.data);
        } else {
          toast.error(response.message || "Failed to load application");
          navigate("/applications");
        }
      } catch (error: any) {
        console.error("Error loading application:", error);
        toast.error("Failed to load application");
        navigate("/applications");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadApplication();
  }, [id, navigate]);

  const handleFormSubmit = async (formData: CreateApplicationFormData) => {
    if (!application) return;

    console.log("Form Data:", formData);
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare data for API (exclude code since it can't be changed)
      const apiData: UpdateApplicationRequest = {
        name: formData.name,
        description: formData.description || undefined,
        url: formData.url || undefined,
        icon: formData.icon || undefined,
        is_active: formData.is_active,
      };

      // Call API
      const response = await applicationService.updateApplication(
        application.id,
        apiData
      );

      if (response.success && response.data) {
        setSuccessMessage(
          `Application "${response.data.name}" updated successfully!`
        );

        // Update local state
        setApplication(response.data);

        // Show success toast
        toast.success("Application updated successfully!", {
          description: `${response.data.name} has been updated.`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/applications");
        }, 1000);
      } else {
        // Handle API errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setErrorMessage(errorMessages.join(", "));
        } else {
          setErrorMessage(response.message || "Failed to update application");
        }

        toast.error("Failed to update application", {
          description:
            response.message || "Please check the form and try again.",
        });
      }
    } catch (error: any) {
      console.error("Error updating application:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error updating application", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "view-details":
        navigate(`/applications/${id}`);
        break;
      case "duplicate-app":
        navigate(`/applications/${id}/duplicate`);
        break;
      case "manage-roles":
        navigate(`/applications/${id}/roles`);
        break;
      case "manage-menus":
        navigate(`/applications/${id}/menus`);
        break;
      default:
        break;
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 font-medium">
            Loading application...
          </span>
        </div>
      </div>
    );
  }

  // Application not found
  if (!application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/applications"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Application not found or you don't have permission to edit it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Convert application data to form data format
  const initialFormData: Partial<CreateApplicationFormData> = {
    name: application.name,
    code: application.code,
    description: application.description || "",
    url: application.url || "",
    icon: application.icon || "",
    is_active: application.is_active,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/applications"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Edit Application
            </h1>
            <p className="text-sm text-gray-600">
              Update application settings and configuration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/applications")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/applications/${id}`)}
            disabled={isLoading}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Application Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">{application.name}</h3>
            <p className="text-sm text-blue-700">@{application.code}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-blue-600">
              <span>{application.roles_count || 0} roles</span>
              <span>{application.menus_count || 0} menus</span>
              <span
                className={`px-2 py-1 rounded-full font-medium ${
                  application.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {application.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
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
          <ApplicationForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            initialData={initialFormData}
            mode="edit"
          />
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <ApplicationEditInfo
            application={application}
            onQuickAction={handleQuickAction}
          />
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 font-medium">
              Updating application...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit-specific info component
const ApplicationEditInfo: React.FC<{
  application: Application;
  onQuickAction: (actionId: string) => void;
}> = ({ application, onQuickAction }) => {
  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onQuickAction("view-details")}
          >
            <Globe className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onQuickAction("duplicate-app")}
          >
            <Globe className="h-4 w-4 mr-2" />
            Duplicate Application
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onQuickAction("manage-roles")}
          >
            <Globe className="h-4 w-4 mr-2" />
            Manage Roles
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onQuickAction("manage-menus")}
          >
            <Globe className="h-4 w-4 mr-2" />
            Manage Menus
          </Button>
        </div>
      </div>

      {/* Application Stats */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">
          Application Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Assigned Roles:</span>
            <span className="font-medium">{application.roles_count || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Menu Items:</span>
            <span className="font-medium">{application.menus_count || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`text-sm font-medium ${
                application.is_active ? "text-green-600" : "text-red-600"
              }`}
            >
              {application.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Created:</span>
            <span className="text-sm text-gray-900">
              {new Date(application.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Edit Guidelines</h3>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Application code cannot be changed after creation</li>
          <li>• Deactivating will hide the application from users</li>
          <li>• URL changes will affect user navigation</li>
          <li>• Test changes before applying to production</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationEditPage;
