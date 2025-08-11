import React from "react";
import {
  Users,
  Search,
  Edit3,
  Save,
  X,
  Shield,
  Crown,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock roles data
const availableRoles = [
  {
    id: 1,
    name: "Super Administrator",
    code: "super_admin",
    description: "Full system access with all privileges",
    level: "system",
    permissions: 45,
  },
  {
    id: 2,
    name: "Administrator",
    code: "admin",
    description: "Administrative access to most system features",
    level: "admin",
    permissions: 32,
  },
  {
    id: 3,
    name: "Manager",
    code: "manager",
    description: "Management level access for specific modules",
    level: "management",
    permissions: 18,
  },
  {
    id: 4,
    name: "Staff",
    code: "staff",
    description: "Standard user access with basic permissions",
    level: "user",
    permissions: 12,
  },
  {
    id: 5,
    name: "Guest",
    code: "guest",
    description: "Limited read-only access",
    level: "guest",
    permissions: 5,
  },
];

const roleAssignmentSchema = z.object({
  selectedRoles: z
    .array(z.number())
    .min(1, "At least one role must be selected"),
});

type RoleAssignmentFormData = z.infer<typeof roleAssignmentSchema>;

const RoleAssignmentSection: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRoles, setSelectedRoles] = React.useState<number[]>([2, 4]); // Default selected roles

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RoleAssignmentFormData>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      selectedRoles: [2, 4],
    },
  });

  // Update form value when selectedRoles changes
  React.useEffect(() => {
    setValue("selectedRoles", selectedRoles);
  }, [selectedRoles, setValue]);

  const filteredRoles = availableRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const onSave = (data: RoleAssignmentFormData) => {
    console.log("Saving role assignment:", data);
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
    setSelectedRoles([2, 4]); // Reset to original
    setSearchQuery("");
  };

  const getRoleIcon = (level: string) => {
    switch (level) {
      case "system":
        return <Crown className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (level: string) => {
    switch (level) {
      case "system":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "management":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border-green-200";
      case "guest":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const selectedRoleObjects = availableRoles.filter((role) =>
    selectedRoles.includes(role.id)
  );
  const totalPermissions = selectedRoleObjects.reduce(
    (sum, role) => sum + role.permissions,
    0
  );

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Role Assignment</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {selectedRoles.length}/5 roles selected
              </p>
            </div>
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
        {/* Search */}
        {isEditing && (
          <div className="space-y-2">
            <Label>Search Roles</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Search and select roles for this user..."
              />
            </div>
          </div>
        )}

        {/* Error */}
        {errors.selectedRoles && (
          <p className="text-sm text-red-500">{errors.selectedRoles.message}</p>
        )}

        {/* Roles List */}
        <div className="space-y-3">
          <Label>Available Roles ({filteredRoles.length})</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedRoles.includes(role.id)
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!isEditing ? "opacity-75" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() =>
                      isEditing && handleRoleToggle(role.id)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-purple-600">
                        {getRoleIcon(role.level)}
                      </div>
                      <h4 className="font-medium text-gray-900">{role.name}</h4>
                      <Badge
                        className={`text-xs ${getRoleBadgeColor(role.level)}`}
                      >
                        {role.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {role.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Code: {role.code}</span>
                      <span>{role.permissions} permissions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Roles Summary */}
        {selectedRoles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">
                Selected Roles Summary
              </h4>
            </div>
            <div className="text-sm text-green-700 mb-3">
              <strong>{selectedRoles.length}</strong> roles selected •
              <strong> {totalPermissions}</strong> total permissions
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRoleObjects.map((role) => (
                <Badge key={role.id} className={getRoleBadgeColor(role.level)}>
                  {getRoleIcon(role.level)}
                  <span className="ml-1">{role.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Role Assignment Guidelines:</p>
            <ul className="text-xs space-y-1 list-disc list-inside ml-4">
              <li>Select one or more roles to assign to this user</li>
              <li>Users inherit permissions from their assigned roles</li>
              <li>Multiple roles combine their permissions</li>
              <li>Higher level roles include lower level permissions</li>
              <li>
                Consider principle of least privilege when assigning roles
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleAssignmentSection;
