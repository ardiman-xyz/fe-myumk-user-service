import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserCog,
  Search,
  Shield,
  Crown,
  Calendar,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";
import { useUserDetail } from "@/hooks/useUserDetail";
import { roleService } from "@/services/roleService";
import { userDetailService } from "@/services/userDetailService";
import type { Role } from "@/types/role";
import type { AvailableRole } from "@/types/userDetail";

interface RoleWithAssignment extends Role {
  is_assigned: boolean;
  assignment_info?: {
    assigned_at: string;
    expires_at?: string;
    assigned_by: number;
    is_active: boolean;
  };
}

const RoleAssignmentSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;

  const {
    userDetailData,
    isLoading: userLoading,
    refreshUserDetail,
  } = useUserDetail(userId);

  const [allRoles, setAllRoles] = useState<RoleWithAssignment[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleWithAssignment[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load all roles
  useEffect(() => {
    loadAllRoles();
  }, []);

  // Update roles with assignment info when user data changes
  useEffect(() => {
    if (userDetailData && allRoles.length > 0) {
      updateRolesWithAssignmentInfo();
    }
  }, [userDetailData, allRoles.length]);

  // Filter roles based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (role.description &&
            role.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(allRoles);
    }
  }, [searchTerm, allRoles]);

  const loadAllRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const response = await roleService.getActiveRoles();

      if (response.success && response.data) {
        const rolesWithAssignment: RoleWithAssignment[] = response.data.map(
          (role) => ({
            ...role,
            is_assigned: false,
          })
        );
        setAllRoles(rolesWithAssignment);
      } else {
        setError("Failed to load roles");
      }
    } catch (err) {
      console.error("Error loading roles:", err);
      setError("Failed to load roles");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const updateRolesWithAssignmentInfo = () => {
    if (!userDetailData?.role_assignments) return;

    const assignedRoleIds = new Set(
      userDetailData.role_assignments.map((assignment) => assignment.role_id)
    );

    const updatedRoles = allRoles.map((role) => {
      const isAssigned = assignedRoleIds.has(role.id);
      const assignmentInfo = userDetailData.role_assignments.find(
        (assignment) => assignment.role_id === role.id
      );

      return {
        ...role,
        is_assigned: isAssigned,
        assignment_info: assignmentInfo
          ? {
              assigned_at: assignmentInfo.assigned_at,
              expires_at: assignmentInfo.expires_at,
              assigned_by: assignmentInfo.assigned_by,
              is_active: assignmentInfo.is_active,
            }
          : undefined,
      };
    });

    setAllRoles(updatedRoles);
  };

  const handleRoleToggle = (roleId: number, isCurrentlyAssigned: boolean) => {
    const newSelectedRoles = new Set(selectedRoles);

    if (isCurrentlyAssigned) {
      // If role is currently assigned, add to removal list
      newSelectedRoles.add(roleId);
    } else {
      // If role is not assigned, add to assignment list
      newSelectedRoles.add(roleId);
    }

    setSelectedRoles(newSelectedRoles);
  };

  const handleAssignRole = async (roleId: number) => {
    if (!userId) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await userDetailService.manageRoles(userId, {
        action: "assign",
        role_id: roleId,
        expires_at: undefined, // Could be extended to support expiration
      });

      if (response.success) {
        setSuccessMessage(`Role assigned successfully`);
        await refreshUserDetail();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(
          response.errors
            ? Object.values(response.errors).flat().join(", ")
            : "Failed to assign role"
        );
      }
    } catch (err) {
      console.error("Error assigning role:", err);
      setError("Failed to assign role");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!userId) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await userDetailService.manageRoles(userId, {
        action: "remove",
        role_id: roleId,
      });

      if (response.success) {
        setSuccessMessage(`Role removed successfully`);
        await refreshUserDetail();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(
          response.errors
            ? Object.values(response.errors).flat().join(", ")
            : "Failed to remove role"
        );
      }
    } catch (err) {
      console.error("Error removing role:", err);
      setError("Failed to remove role");
    } finally {
      setIsProcessing(false);
    }
  };

  const assignedRolesCount = allRoles.filter((role) => role.is_assigned).length;
  const availableRolesCount = allRoles.filter(
    (role) => !role.is_assigned
  ).length;

  if (userLoading || isLoadingRoles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-purple-600" />
            Role Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading roles...</span>
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
            <UserCog className="h-5 w-5 text-purple-600" />
            Role Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load user information.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-purple-600" />
            Role Assignment
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline">{assignedRolesCount} assigned</Badge>
            <Badge variant="secondary">{availableRolesCount} available</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Select one or more roles to assign to this user. Users inherit
          permissions from their assigned roles.
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
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search roles</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role name, code, or description..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No roles found matching your search"
                : "No roles available"}
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`p-4 border rounded-lg transition-colors ${
                  role.is_assigned
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {role.is_admin ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Shield className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{role.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {role.code}
                          </Badge>
                          {role.is_admin && (
                            <Badge
                              variant="default"
                              className="text-xs bg-yellow-100 text-yellow-800"
                            >
                              Admin
                            </Badge>
                          )}
                          {role.is_assigned && (
                            <Badge
                              variant="default"
                              className="text-xs bg-green-100 text-green-800"
                            >
                              Assigned
                            </Badge>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {role.description}
                          </p>
                        )}

                        {/* Assignment Info */}
                        {role.is_assigned && role.assignment_info && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Assigned:{" "}
                              {new Date(
                                role.assignment_info.assigned_at
                              ).toLocaleDateString()}
                            </div>
                            {role.assignment_info.expires_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires:{" "}
                                {new Date(
                                  role.assignment_info.expires_at
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {role.is_assigned ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRole(role.id)}
                        disabled={isProcessing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Minus className="h-4 w-4 mr-1" />
                            Remove
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignRole(role.id)}
                        disabled={isProcessing}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredRoles.length > 0 && (
          <div className="pt-4 border-t text-sm text-gray-600">
            Showing {filteredRoles.length} of {allRoles.length} roles
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleAssignmentSection;
