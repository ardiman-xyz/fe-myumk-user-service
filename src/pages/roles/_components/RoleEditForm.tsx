import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Code,
  Type,
  Loader2,
  Save,
  Crown,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  RoleEditFormData,
  ApplicationWithChecked,
} from "@/types/roleEditTypes";
import ApplicationPermissionSelectorWithChecked from "./ApplicationPermissionSelectorWithChecked";

interface RoleEditFormProps {
  onSubmit: (data: RoleEditFormData) => Promise<void>;
  isLoading?: boolean;
  availableApplications: ApplicationWithChecked[];
  formData: RoleEditFormData;
  onFormDataChange: (field: keyof RoleEditFormData, value: any) => void;
  onApplicationsChange: (applications: number[]) => void;
  onPermissionsChange: (permissions: number[]) => void;
  disabled?: boolean;
}

const RoleEditForm: React.FC<RoleEditFormProps> = ({
  onSubmit,
  isLoading = false,
  availableApplications,
  formData,
  onFormDataChange,
  onApplicationsChange,
  onPermissionsChange,
  disabled = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes for unsaved warning
  useEffect(() => {
    // This would compare with original data if needed
    setHasUnsavedChanges(true);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }

    if (formData.name.length < 3) {
      newErrors.name = "Role name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof RoleEditFormData, value: any) => {
    onFormDataChange(field, value);

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const isFormValid =
    formData.name.trim().length >= 3 && Object.keys(errors).length === 0;

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have unsaved changes. Make sure to save your changes before
            leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Basic Information
            <span className="text-sm text-gray-500 font-normal ml-2">
              (Edit Mode)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              Role Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter role name (e.g., Content Manager)"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading || disabled}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500">
              Choose a descriptive name that clearly indicates the role's
              purpose
            </p>
          </div>

          {/* Role Code (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Role Code *
              <Lock className="h-3 w-3 text-gray-400 ml-1" />
            </Label>
            <div className="relative">
              <Input
                id="code"
                name="code"
                type="text"
                value={formData.code || ""}
                className="bg-gray-50 text-gray-600"
                disabled={true}
                readOnly
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Role code cannot be changed after creation for security reasons
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the role's purpose and responsibilities..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isLoading || disabled}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Optional description to help others understand this role's purpose
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Role Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Role Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin Role Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Administrator Role
                </h4>
                <p className="text-xs text-gray-600">
                  Admin roles have elevated privileges and system access
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="is_admin"
                name="is_admin"
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) =>
                  handleInputChange("is_admin", e.target.checked)
                }
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Active Role
                </h4>
                <p className="text-xs text-gray-600">
                  Deactivating will immediately affect all assigned users
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  handleInputChange("is_active", e.target.checked)
                }
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {/* Admin Role Warning */}
          {formData.is_admin && (
            <Alert className="border-purple-200 bg-purple-50">
              <Crown className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Admin Role:</strong> This role will have elevated system
                privileges. Admin roles typically inherit most permissions
                automatically and should only be assigned to trusted users.
              </AlertDescription>
            </Alert>
          )}

          {/* Deactivation Warning */}
          {!formData.is_active && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Warning:</strong> Deactivating this role will
                immediately remove access for all users currently assigned to
                it.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Applications & Permissions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600" />
            Application Access & Permissions
            <span className="text-sm text-gray-500 font-normal">
              ({formData.applications.length} apps,{" "}
              {formData.permissions.length} permissions)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Select applications this role can access, then choose specific
                permissions for each application and its menus.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">
                      Edit Mode - Current Selections:
                    </p>
                    <ul className="text-xs text-indigo-700 mt-1 space-y-1">
                      <li>• Checkboxes show current role permissions</li>
                      <li>
                        • Changes will affect all users assigned to this role
                      </li>
                      <li>
                        • Application access controls navigation visibility
                      </li>
                      <li>
                        • Specific permissions control what actions users can
                        perform
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <ApplicationPermissionSelectorWithChecked
              initialApplications={availableApplications}
              selectedApplications={formData.applications}
              selectedPermissions={formData.permissions}
              onApplicationsChange={onApplicationsChange}
              onPermissionsChange={onPermissionsChange}
              disabled={isLoading || disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Summary */}
      {(formData.permissions.length > 0 ||
        formData.applications.length > 0) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Updated Role Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-900 mb-2">
                    Basic Info:
                  </h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Name: {formData.name || "Not set"}</li>
                    <li>
                      • Type: {formData.is_admin ? "Admin Role" : "User Role"}
                    </li>
                    <li>
                      • Status: {formData.is_active ? "Active" : "Inactive"}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Access:</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Applications: {formData.applications.length}</li>
                    <li>• Permissions: {formData.permissions.length}</li>
                    <li>• Admin Access: {formData.is_admin ? "Yes" : "No"}</li>
                    <li>
                      • Can be assigned: {formData.is_active ? "Yes" : "No"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-green-200">
                <h4 className="font-medium text-green-900 mb-2">
                  Impact of Changes:
                </h4>
                <p className="text-xs text-green-700">
                  This role update will immediately affect all users currently
                  assigned to this role. They will gain or lose access based on
                  the new application and permission selections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Role
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RoleEditForm;
