// src/pages/permissions/_components/PermissionCrudGenerator.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  Tag,
  Type,
  Loader2,
  CheckCircle,
  Eye,
  Plus,
  Edit,
  Trash2,
  Info,
} from "lucide-react";
import { COMMON_RESOURCES } from "@/types/permission";

interface PermissionCrudGeneratorProps {
  onGenerate: (resource: string, resourceDisplayName: string) => Promise<void>;
  isLoading?: boolean;
}

interface CrudFormData {
  resource: string;
  resourceDisplayName: string;
  description: string;
}

const PermissionCrudGenerator: React.FC<PermissionCrudGeneratorProps> = ({
  onGenerate,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CrudFormData>({
    resource: "",
    resourceDisplayName: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<CrudFormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof CrudFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Auto-generate resource display name from resource
    if (name === "resource" && !formData.resourceDisplayName) {
      const displayName = value
        .split(".")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      setFormData((prev) => ({
        ...prev,
        resourceDisplayName: displayName,
      }));
    }
  };

  const handleResourceSelect = (
    resourceValue: string,
    resourceLabel: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      resource: resourceValue,
      resourceDisplayName: resourceLabel,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CrudFormData> = {};

    if (!formData.resource.trim()) {
      newErrors.resource = "Resource is required";
    } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.resource)) {
      newErrors.resource =
        "Resource can only contain letters, numbers, dots, and underscores";
    }

    if (!formData.resourceDisplayName.trim()) {
      newErrors.resourceDisplayName = "Resource display name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (validateForm()) {
      await onGenerate(
        formData.resource.toLowerCase(),
        formData.resourceDisplayName
      );
    }
  };

  const getPreviewPermissions = () => {
    if (!formData.resource || !formData.resourceDisplayName) return [];

    const resource = formData.resource.toLowerCase();
    const displayName = formData.resourceDisplayName;

    return [
      {
        icon: Eye,
        name: `View ${displayName}`,
        code: `${resource}.view`,
        description: `Can view ${displayName.toLowerCase()} list and details`,
        color: "text-blue-600 bg-blue-50",
      },
      {
        icon: Plus,
        name: `Create ${displayName}`,
        code: `${resource}.create`,
        description: `Can create new ${displayName.toLowerCase()}`,
        color: "text-green-600 bg-green-50",
      },
      {
        icon: Edit,
        name: `Edit ${displayName}`,
        code: `${resource}.edit`,
        description: `Can edit existing ${displayName.toLowerCase()}`,
        color: "text-yellow-600 bg-yellow-50",
      },
      {
        icon: Trash2,
        name: `Delete ${displayName}`,
        code: `${resource}.delete`,
        description: `Can delete ${displayName.toLowerCase()}`,
        color: "text-red-600 bg-red-50",
      },
    ];
  };

  const previewPermissions = getPreviewPermissions();

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            CRUD Permission Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resource Input */}
          <div className="space-y-2">
            <Label htmlFor="resource" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Resource Identifier *
            </Label>
            <Input
              id="resource"
              name="resource"
              type="text"
              placeholder="e.g., users, posts, categories"
              value={formData.resource}
              onChange={handleInputChange}
              className={errors.resource ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.resource && (
              <p className="text-sm text-red-600">{errors.resource}</p>
            )}
            <p className="text-xs text-gray-500">
              Use lowercase with dots for hierarchy (e.g., "admin.users",
              "blog.posts")
            </p>

            {/* Quick Select Common Resources */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-medium">Quick Select:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {COMMON_RESOURCES.map((resource) => (
                  <Button
                    key={resource.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto p-2 text-left"
                    onClick={() =>
                      handleResourceSelect(resource.value, resource.label)
                    }
                    disabled={isLoading}
                  >
                    <div>
                      <div className="font-medium">{resource.label}</div>
                      <div className="text-gray-500">{resource.value}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Display Name */}
          <div className="space-y-2">
            <Label
              htmlFor="resourceDisplayName"
              className="flex items-center gap-1"
            >
              <Type className="h-3 w-3" />
              Display Name *
            </Label>
            <Input
              id="resourceDisplayName"
              name="resourceDisplayName"
              type="text"
              placeholder="e.g., Users, Blog Posts, Categories"
              value={formData.resourceDisplayName}
              onChange={handleInputChange}
              className={errors.resourceDisplayName ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.resourceDisplayName && (
              <p className="text-sm text-red-600">
                {errors.resourceDisplayName}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Human-readable name used in permission descriptions
            </p>
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional notes about this resource..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={2}
            />
            <p className="text-xs text-gray-500">
              Optional description for documentation purposes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewPermissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Permission Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                The following 4 permissions will be created:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {previewPermissions.map((permission, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${permission.color}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${permission.color}`}>
                        <permission.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">
                          {permission.name}
                        </h4>
                        <p className="text-xs text-gray-600 font-mono mt-1">
                          {permission.code}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleGenerate}
          disabled={
            isLoading || !formData.resource || !formData.resourceDisplayName
          }
          className="min-w-[160px]"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate 4 Permissions
            </>
          )}
        </Button>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          What will be created:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>View Permission:</strong> Read-only access to the resource
          </li>
          <li>
            • <strong>Create Permission:</strong> Ability to create new
            instances
          </li>
          <li>
            • <strong>Edit Permission:</strong> Ability to modify existing
            instances
          </li>
          <li>
            • <strong>Delete Permission:</strong> Ability to remove instances
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> These permissions can be assigned to roles
            individually, allowing for fine-grained access control based on your
            specific requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionCrudGenerator;
