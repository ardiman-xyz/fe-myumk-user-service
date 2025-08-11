// src/pages/users/_components/PersonalInformationSection.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { userDetailService } from "@/services/userDetailService";
import { useUserDetail } from "@/hooks/useUserDetail";
import type { UpdateUserDetailRequest } from "@/types/userDetail";

const PersonalInformationSection = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;

  const {
    userDetailData,
    isLoading,
    error: loadError,
    refreshUserDetail,
  } = useUserDetail(userId);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Update form data when user detail is loaded
  useEffect(() => {
    if (userDetailData?.user) {
      setFormData({
        username: userDetailData.user.username,
        email: userDetailData.user.email,
        first_name: userDetailData.user.first_name,
        last_name: userDetailData.user.last_name,
        phone: userDetailData.user.phone || "",
      });
    }
  }, [userDetailData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId || !userDetailData?.user) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      const updateData: UpdateUserDetailRequest = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined,
      };

      const response = await userDetailService.updateUserDetail(
        userId,
        updateData
      );

      if (response.success) {
        setSuccessMessage("Personal information updated successfully");
        // Refresh user detail data
        await refreshUserDetail();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSaveError(
          response.errors
            ? Object.values(response.errors).flat().join(", ")
            : "Failed to update personal information"
        );
      }
    } catch (err) {
      console.error("Error updating user detail:", err);
      setSaveError("Failed to update personal information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (userDetailData?.user) {
      setFormData({
        username: userDetailData.user.username,
        email: userDetailData.user.email,
        first_name: userDetailData.user.first_name,
        last_name: userDetailData.user.last_name,
        phone: userDetailData.user.phone || "",
      });
      setSaveError(null);
      setSuccessMessage(null);
    }
  };

  const hasChanges =
    userDetailData?.user &&
    (formData.username !== userDetailData.user.username ||
      formData.email !== userDetailData.user.email ||
      formData.first_name !== userDetailData.user.first_name ||
      formData.last_name !== userDetailData.user.last_name ||
      formData.phone !== (userDetailData.user.phone || ""));

  const displayError = loadError || saveError;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading user information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userDetailData?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              User not found or failed to load user information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const userDetail = userDetailData.user;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={userDetail.is_active ? "default" : "destructive"}>
              {userDetail.is_active ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Update basic information for this user account
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
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
        {displayError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {/* User Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userDetail.roles_count}
            </div>
            <div className="text-sm text-gray-600">Assigned Roles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userDetail.applications_count}
            </div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userDetail.permissions_count}
            </div>
            <div className="text-sm text-gray-600">Permissions</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="pl-10"
              />
            </div>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="pl-10"
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-2">
            <Label>Account Information</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span>
                  {new Date(userDetail.created_at).toLocaleDateString()}
                </span>
              </div>
              {userDetail.last_login_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Last Login:</span>
                  <span>
                    {new Date(userDetail.last_login_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {userDetail.email_verified_at ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Email Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">Email Not Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationSection;
