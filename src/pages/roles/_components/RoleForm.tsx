import React, { useState, useCallback } from "react";
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
  Rocket,
  Crown,
  CheckCircle,
  AlertCircle,
  Globe,
  Key,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { RoleFormValidator, type CreateRoleFormData } from "@/types/role";
import IntegratedAppPermissionSelector from "./IntegratedAppPermissionSelector";

interface RoleFormProps {
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateRoleFormData>;
  mode?: "create" | "edit";
}

interface FormErrors {
  [key: string]: string;
}

const RoleForm: React.FC<RoleFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  mode = "create",
}) => {
  const [formData, setFormData] = useState<CreateRoleFormData>({
    name: "",
    code: "",
    description: "",
    is_admin: false,
    is_active: true,
    permissions: [],
    applications: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [codeGenerated, setCodeGenerated] = useState(false);

  const validateField = useCallback(
    (fieldName: keyof CreateRoleFormData, value: any) => {
      const error = RoleFormValidator.validateField(
        fieldName,
        value,
        formData,
        mode
      );

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName] = error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    },
    [formData, mode]
  );

  // Auto-generate code from name
  const generateCodeFromName = (name: string) => {
    if (!name || codeGenerated) return "";

    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/_{2,}/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof CreateRoleFormData;

    let newValue: any = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));

    // Auto-generate code when name changes (only for create mode)
    if (fieldName === "name" && mode === "create" && !codeGenerated) {
      const generatedCode = generateCodeFromName(value);
      if (generatedCode) {
        setFormData((prev) => ({
          ...prev,
          code: generatedCode,
        }));
      }
    }

    // Mark field as touched and validate
    if (touchedFields.has(fieldName)) {
      validateField(fieldName, newValue);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCodeGenerated(true); // Mark as manually edited
    setFormData((prev) => ({
      ...prev,
      code: value,
    }));

    if (touchedFields.has("code")) {
      validateField("code", value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name as keyof CreateRoleFormData;
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    validateField(fieldName, formData[fieldName]);
  };

  const handlePermissionsChange = (selectedPermissions: number[]) => {
    setFormData((prev) => ({
      ...prev,
      permissions: selectedPermissions,
    }));
  };

  const handleApplicationsChange = (selectedApplications: number[]) => {
    setFormData((prev) => ({
      ...prev,
      applications: selectedApplications,
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as Array<keyof CreateRoleFormData>;
    setTouchedFields(new Set(allFields));

    // Validate entire form
    const formErrors = RoleFormValidator.validateForm(formData) as FormErrors;
    setErrors(formErrors);

    // If no errors, submit
    if (Object.keys(formErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return touchedFields.has(fieldName) ? errors[fieldName] : undefined;
  };

  const isFieldInvalid = (fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName];
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Basic Information
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
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={isFieldInvalid("name") ? "border-red-500" : ""}
              disabled={isLoading}
              aria-invalid={isFieldInvalid("name")}
            />
            {getFieldError("name") && (
              <p className="text-sm text-red-600">{getFieldError("name")}</p>
            )}
            <p className="text-xs text-gray-500">
              Choose a descriptive name that clearly indicates the role's
              purpose
            </p>
          </div>

          {/* Role Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Role Code *
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter role code (e.g., content_manager)"
              value={formData.code}
              onChange={handleCodeChange}
              onBlur={handleBlur}
              className={isFieldInvalid("code") ? "border-red-500" : ""}
              disabled={isLoading || mode === "edit"}
              aria-invalid={isFieldInvalid("code")}
            />
            {getFieldError("code") && (
              <p className="text-sm text-red-600">{getFieldError("code")}</p>
            )}
            <p className="text-xs text-gray-500">
              {mode === "edit"
                ? "Role code cannot be changed after creation"
                : "Unique identifier using lowercase letters, numbers, and underscores only"}
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
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={isFieldInvalid("description") ? "border-red-500" : ""}
              disabled={isLoading}
              rows={3}
            />
            {getFieldError("description") && (
              <p className="text-sm text-red-600">
                {getFieldError("description")}
              </p>
            )}
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
                onChange={handleInputChange}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                disabled={isLoading}
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
                  Only active roles can be assigned to users
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={isLoading}
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
                      How it works:
                    </p>
                    <ul className="text-xs text-indigo-700 mt-1 space-y-1">
                      <li>
                        • First select which applications this role can access
                      </li>
                      <li>
                        • Then expand each application to see available menus
                        and permissions
                      </li>
                      <li>
                        • Choose specific permissions for granular access
                        control
                      </li>
                      <li>
                        • Application access controls navigation, permissions
                        control actions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <IntegratedAppPermissionSelector
              selectedApplications={formData.applications}
              selectedPermissions={formData.permissions}
              onApplicationsChange={handleApplicationsChange}
              onPermissionsChange={handlePermissionsChange}
              disabled={isLoading}
            />

            {(getFieldError("applications") ||
              getFieldError("permissions")) && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {getFieldError("applications") ||
                    getFieldError("permissions")}
                </AlertDescription>
              </Alert>
            )}
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
              Role Summary
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
                    <li>• Code: {formData.code || "Not set"}</li>
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

              {formData.applications.length > 0 && (
                <div className="pt-3 border-t border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">
                    Access Overview:
                  </h4>
                  <p className="text-xs text-green-700">
                    This role will have access to {formData.applications.length}{" "}
                    application{formData.applications.length !== 1 ? "s" : ""}
                    with {formData.permissions.length} specific permission
                    {formData.permissions.length !== 1 ? "s" : ""}. Users
                    assigned this role will see only the applications selected
                    above in their navigation and can only perform actions
                    allowed by the selected permissions.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || Object.keys(errors).length > 0}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              {mode === "create" ? "Create Role" : "Update Role"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RoleForm;
