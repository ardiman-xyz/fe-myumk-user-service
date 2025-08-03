import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import type {
  CreateApplicationFormData,
  CreateApplicationRequest,
} from "@/types/application";

import { applicationService } from "@/services/applicationService";
import ApplicationForm from "./_components/ApplicationForm";
import ApplicationCreateInfo from "./_components/ApplicationCreateInfo";

const AddApplicationPage: React.FC = () => {
  useTitle("Add Application - User Service");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (formData: CreateApplicationFormData) => {
    console.log("Form Data:", formData);
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare data for API
      const apiData: CreateApplicationRequest = {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        url: formData.url || undefined,
        icon: formData.icon || undefined,
        is_active: formData.is_active,
      };

      // Call API
      const response = await applicationService.createApplication(apiData);

      if (response.success && response.data) {
        setSuccessMessage(
          `Application "${response.data.name}" created successfully!`
        );

        // Show success toast
        toast.success("Application created successfully!", {
          description: `${response.data.name} has been added to the system.`,
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
          setErrorMessage(response.message || "Failed to create application");
        }

        toast.error("Failed to create application", {
          description:
            response.message || "Please check the form and try again.",
        });
      }
    } catch (error: any) {
      console.error("Error creating application:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);

      toast.error("Error creating application", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "import-config":
        toast.info("Feature coming soon", {
          description: "Import configuration template will be available soon.",
        });
        break;
      case "duplicate-existing":
        navigate("/applications", {
          state: { action: "duplicate" },
        });
        break;
      case "app-templates":
        toast.info("Feature coming soon", {
          description:
            "Pre-defined application templates will be available soon.",
        });
        break;
      case "integration-guide":
        toast.info("Feature coming soon", {
          description: "Integration guide will be available soon.",
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
              Add New Application
            </h1>
            <p className="text-sm text-gray-600">
              Create a new application with configuration and access controls
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
            mode="create"
          />
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <ApplicationCreateInfo onQuickAction={handleQuickAction} />
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 font-medium">
              Creating application...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddApplicationPage;
