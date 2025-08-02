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
  Rocket,
  Key,
  Crown,
  Users,
  CheckCircle,
} from "lucide-react";

import { RoleFormValidator, type CreateRoleFormData } from "@/types/role";
import ApplicationSelector from "./ApplicationSelector";
import PermissionSelector from "./PermissionSelector";

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
    const formErrors = RoleFormValidator.validateForm(formData);
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
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-orange-600" />
            Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PermissionSelector
            selectedPermissions={formData.permissions || []}
            onPermissionsChange={handlePermissionsChange}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* Applications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationSelector
            selectedApplications={formData.applications || []}
            onApplicationsChange={handleApplicationsChange}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

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
