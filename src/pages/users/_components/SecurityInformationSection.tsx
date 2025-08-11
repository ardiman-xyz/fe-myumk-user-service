import React from "react";
import { useParams } from "react-router";
import {
  Shield,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Lock,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserDetail } from "@/hooks/useUserDetail";
import { userDetailService } from "@/services/userDetailService";

const securityInfoSchema = z
  .object({
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters",
      })
      .refine((val) => !val || /[A-Z]/.test(val), {
        message: "Password must contain uppercase letter",
      })
      .refine((val) => !val || /[a-z]/.test(val), {
        message: "Password must contain lowercase letter",
      })
      .refine((val) => !val || /[0-9]/.test(val), {
        message: "Password must contain number",
      }),
    confirmPassword: z.string().optional(),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type SecurityInfoFormData = z.infer<typeof securityInfoSchema>;

const SecurityInformationSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;

  const { userDetailData, isLoading, refreshUserDetail } =
    useUserDetail(userId);

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SecurityInfoFormData>({
    resolver: zodResolver(securityInfoSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const password = watch("password");

  // Update form when user data is loaded
  React.useEffect(() => {
    if (userDetailData?.user) {
      setValue("is_active", userDetailData.user.is_active);
    }
  }, [userDetailData, setValue]);

  const onSave = async (data: SecurityInfoFormData) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Prepare update data
      const updateData: any = {
        is_active: data.is_active,
      };

      // Only include password if it's provided
      if (data.password && data.password.trim()) {
        updateData.password = data.password;
      }

      const response = await userDetailService.updateAccountSecurity(
        userId,
        updateData
      );

      if (response.success) {
        setSuccessMessage(
          data.password
            ? "Password and account status updated successfully"
            : "Account status updated successfully"
        );
        setIsEditing(false);

        // Clear password fields after save
        setValue("password", "");
        setValue("confirmPassword", "");

        // Refresh user detail data
        await refreshUserDetail();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(
          response.errors
            ? Object.values(response.errors).flat().join(", ")
            : "Failed to update account security"
        );
      }
    } catch (err) {
      console.error("Error updating account security:", err);
      setError("Failed to update account security");
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);

    // Reset form to current user data
    if (userDetailData?.user) {
      reset({
        password: "",
        confirmPassword: "",
        is_active: userDetailData.user.is_active,
      });
    }
  };

  const hasChanges =
    userDetailData?.user &&
    (password !== "" || isActive !== userDetailData.user.is_active);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="h-6 w-6" />
            </div>
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading security information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userDetailData?.user) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="h-6 w-6" />
            </div>
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load user security information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const userDetail = userDetailData.user;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="h-6 w-6" />
            </div>
            <CardTitle>Security Information</CardTitle>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit(onSave)}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <Alert variant="default" className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              disabled={!isEditing}
              className="pl-10 pr-10"
              placeholder={isEditing ? "Enter new password" : "••••••••••••"}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          {isEditing && (
            <p className="text-xs text-gray-500">
              Leave blank to keep current password. If changing: min 8 chars,
              include uppercase, lowercase, and number
            </p>
          )}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                disabled={!password}
                className="pl-10 pr-10"
                placeholder="Confirm new password if changing"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked: boolean) =>
                setValue("is_active", checked as boolean)
              }
              disabled={!isEditing}
            />
            <Label
              htmlFor="is_active"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Active Account
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            Inactive accounts cannot login to the system
          </p>
        </div>

        {/* Security Status */}
        {!isEditing && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Security Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span
                  className={`font-medium ${
                    userDetail.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userDetail.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-gray-600">••••••••••••</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-gray-600">
                  {new Date(userDetail.updated_at).toLocaleDateString()}
                </span>
              </div>
              {userDetail.last_login_at && (
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span className="text-gray-600">
                    {new Date(userDetail.last_login_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityInformationSection;
