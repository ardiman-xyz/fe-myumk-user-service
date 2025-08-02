import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Code,
  Type,
  Loader2,
  Save,
  Rocket,
  ExternalLink,
  Image,
  CheckCircle,
  Eye,
} from "lucide-react";
import {
  createApplicationSchema,
  ApplicationFormValidator,
  type CreateApplicationFormData,
  AVAILABLE_ICONS,
} from "@/types/application";
import IconSelector from "./IconSelector";
import ApplicationPreview from "./ApplicationPreview";

interface ApplicationFormProps {
  onSubmit: (data: CreateApplicationFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateApplicationFormData>;
  mode?: "create" | "edit";
}

interface FormErrors {
  [key: string]: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  mode = "create",
}) => {
  const [formData, setFormData] = useState<CreateApplicationFormData>({
    name: "",
    code: "",
    description: "",
    url: "",
    icon: "",
    is_active: true,
    ...initialData,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const validateField = useCallback(
    (fieldName: keyof CreateApplicationFormData, value: any) => {
      const error = ApplicationFormValidator.validateField(
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

    return ApplicationFormValidator.generateCodeFromName(name);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof CreateApplicationFormData;

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

  const handleIconChange = (iconName: string) => {
    setFormData((prev) => ({
      ...prev,
      icon: iconName,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name as keyof CreateApplicationFormData;
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as Array<
      keyof CreateApplicationFormData
    >;
    setTouchedFields(new Set(allFields));

    // Validate entire form
    const formErrors = ApplicationFormValidator.validateForm(formData);
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
            <Globe className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Application Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              Application Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter application name (e.g., User Management System)"
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
              Choose a descriptive name that clearly identifies the application
            </p>
          </div>

          {/* Application Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Application Code *
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter application code (e.g., user_mgmt)"
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
                ? "Application code cannot be changed after creation"
                : "Unique identifier using lowercase letters, numbers, and underscores only"}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the application's purpose and functionality..."
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
              Optional description to help others understand this application's
              purpose
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Application Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-purple-600" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Application URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Application URL
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com (optional)"
              value={formData.url}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={isFieldInvalid("url") ? "border-red-500" : ""}
              disabled={isLoading}
              aria-invalid={isFieldInvalid("url")}
            />
            {getFieldError("url") && (
              <p className="text-sm text-red-600">{getFieldError("url")}</p>
            )}
            <p className="text-xs text-gray-500">
              Full URL to access the application (leave empty if no web
              interface)
            </p>
          </div>

          {/* Application Icon */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              Application Icon
            </Label>
            <IconSelector
              selectedIcon={formData.icon || ""}
              onIconChange={handleIconChange}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Choose an icon to help users identify this application
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Application Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Active Application
                </h4>
                <p className="text-xs text-gray-600">
                  Only active applications can be assigned to roles and accessed
                  by users
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

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-600" />
            Preview
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              disabled={isLoading}
            >
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </CardTitle>
        </CardHeader>
        {showPreview && (
          <CardContent>
            <ApplicationPreview applicationData={formData} />
          </CardContent>
        )}
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
              {mode === "create" ? "Create Application" : "Update Application"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationForm;
