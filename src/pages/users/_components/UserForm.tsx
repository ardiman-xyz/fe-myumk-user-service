import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Rocket,
  Shield,
} from "lucide-react";
import {
  createUserSchema,
  updateUserSchema,
  UserFormValidator,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/types/user";
import RoleSelector from "./RoleSelector"; // Import your RoleSelector component
import UserPrivilegeSection from "./UserPrivilegeSection";

interface UserFormProps {
  onSubmit: (
    formData: CreateUserFormData,
    privilegeData: PrivilegeData
  ) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateUserFormData>;
  mode?: "create" | "edit";
}

interface FormErrors {
  [key: string]: string;
}

interface PrivilegeData {
  selectedApplications: number[];
  selectedPermissions: number[];
  notes: string;
  expiration: string;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  mode = "create",
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_active: true,
    roles: [], // Add roles field
    ...initialData,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const [privilegeData, setPrivilegeData] = useState<PrivilegeData>({
    selectedApplications: [],
    selectedPermissions: [],
    notes: "",
    expiration: "",
  });

  const validateField = useCallback(
    (fieldName: keyof CreateUserFormData, value: any) => {
      const error = UserFormValidator.validateField(
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof CreateUserFormData;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));

    // Validate field if it has been touched
    if (touchedFields.has(fieldName)) {
      validateField(fieldName, newValue);
    }

    // Special case: if password changes, revalidate confirmPassword
    if (fieldName === "password" && touchedFields.has("confirmPassword")) {
      validatePasswordMatch(String(newValue), String(formData.confirmPassword));
    }

    // Special case: if confirmPassword changes, validate it against password
    if (fieldName === "confirmPassword") {
      validatePasswordMatch(String(formData.password), String(newValue));
    }
  };

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    if (mode === "edit") {
      // In edit mode, only validate if either field has a value
      if (password || confirmPassword) {
        const error =
          password !== confirmPassword ? "Passwords don't match" : null;
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors.confirmPassword = error;
          } else {
            delete newErrors.confirmPassword;
          }
          return newErrors;
        });
      }
    } else {
      // Create mode - validate normally
      const error =
        password !== confirmPassword ? "Passwords don't match" : null;
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.confirmPassword = error;
        } else {
          delete newErrors.confirmPassword;
        }
        return newErrors;
      });
    }
  };

  const handleRolesChange = (roleIds: number[]) => {
    setFormData((prev) => ({
      ...prev,
      roles: roleIds,
    }));

    // Clear role error if exists
    if (errors.roles) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.roles;
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof CreateUserFormData;
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    validateField(fieldName, formData[fieldName]);
  };

  const validateFormForSubmission = () => {
    const isValid = UserFormValidator.validateForm(formData, mode);
    const validationErrors = typeof isValid === "boolean" ? {} : isValid;

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as Array<keyof CreateUserFormData>;
    setTouchedFields(new Set(allFields));

    // Validate entire form
    const isValid = validateFormForSubmission();

    // If valid, submit
    if (isValid) {
      await onSubmit(formData, privilegeData);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return touchedFields.has(fieldName) ? errors[fieldName] : undefined;
  };

  const isFieldInvalid = (fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName];
  };

  const isPasswordRequired = mode === "create";

  const handlePrivilegeChange = (data: PrivilegeData) => {
    setPrivilegeData(data);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={
                    isFieldInvalid("first_name") ? "border-red-500" : ""
                  }
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid("first_name")}
                />
                {getFieldError("first_name") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("first_name")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={
                    isFieldInvalid("last_name") ? "border-red-500" : ""
                  }
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid("last_name")}
                />
                {getFieldError("last_name") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("last_name")}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={isFieldInvalid("username") ? "border-red-500" : ""}
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid("username")}
                />
                {getFieldError("username") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("username")}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 ${
                      isFieldInvalid("email") ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={isFieldInvalid("email")}
                  />
                </div>
                {getFieldError("email") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pl-10 ${
                      isFieldInvalid("phone") ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={isFieldInvalid("phone")}
                  />
                </div>
                {getFieldError("phone") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("phone")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {isPasswordRequired ? "*" : ""}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      mode === "edit"
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pr-10 ${
                      isFieldInvalid("password") ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={isFieldInvalid("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {getFieldError("password") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("password")}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {mode === "edit"
                    ? "Leave blank to keep current password. If changing: min 8 chars, include uppercase, lowercase, and number"
                    : "Min 8 chars, include uppercase, lowercase, and number"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password {isPasswordRequired ? "*" : ""}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={
                      mode === "edit"
                        ? "Confirm new password if changing"
                        : "Confirm password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`pr-10 ${
                      isFieldInvalid("confirmPassword") ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={isFieldInvalid("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {getFieldError("confirmPassword") && (
                  <p className="text-sm text-red-600">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Label htmlFor="is_active" className="text-sm font-normal">
                  Active Account
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Inactive accounts cannot login to the system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Role Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Assign Roles {mode === "create" ? "*" : ""}
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Select one or more roles to assign to this user. Users inherit
                permissions from their assigned roles.
              </p>

              <RoleSelector
                selectedRoles={formData.roles}
                onRolesChange={handleRolesChange}
                disabled={isLoading}
                multiple={true}
                placeholder="Search and select roles for this user..."
                error={errors.roles}
                maxSelection={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Summary */}
      {(formData.roles.length > 0 || mode === "edit") && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              User Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-900 mb-2">Basic Info:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>
                    • Name: {formData.first_name} {formData.last_name}
                  </li>
                  <li>• Username: {formData.username || "Not set"}</li>
                  <li>• Email: {formData.email || "Not set"}</li>
                  <li>
                    • Status: {formData.is_active ? "Active" : "Inactive"}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-2">Access:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Roles: {formData.roles.length} assigned</li>
                  <li>• Can login: {formData.is_active ? "Yes" : "No"}</li>
                  <li>
                    • Password:{" "}
                    {formData.password
                      ? "Set"
                      : mode === "edit"
                      ? "Keep current"
                      : "Not set"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <UserPrivilegeSection onPrivilegeChange={handlePrivilegeChange} />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
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
              {mode === "create" ? "Create User" : "Update User"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
