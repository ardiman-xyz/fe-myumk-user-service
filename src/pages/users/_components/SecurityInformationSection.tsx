import React from "react";
import { Shield, Eye, EyeOff, Edit3, Save, X, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
    isActive: z.boolean(),
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
  const [isEditing, setIsEditing] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
      isActive: true,
    },
  });

  const isActive = watch("isActive");
  const password = watch("password");

  const onSave = (data: SecurityInfoFormData) => {
    console.log("Saving security info:", {
      ...data,
      password: data.password ? "[ENCRYPTED]" : "[UNCHANGED]",
    });
    setIsEditing(false);
    // Clear password fields after save
    setValue("password", "");
    setValue("confirmPassword", "");
  };

  const onCancel = () => {
    setIsEditing(false);
    reset({
      password: "",
      confirmPassword: "",
      isActive: true,
    });
  };

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
                <Button variant="outline" size="sm" onClick={onCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit(onSave)}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
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
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              disabled={!isEditing}
              className="pl-10 pr-10"
              placeholder={
                isEditing
                  ? "Enter new password"
                  : "Leave blank to keep current password"
              }
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

        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              disabled={!isEditing || !password}
              className="pl-10 pr-10"
              placeholder="Confirm new password if changing"
            />
            {isEditing && password && (
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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked: boolean) =>
                setValue("isActive", checked as boolean)
              }
              disabled={!isEditing}
            />
            <Label
              htmlFor="isActive"
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
                    isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-gray-600">••••••••••••</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-gray-600">2 days ago</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityInformationSection;
