import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Key,
  Plus,
  X,
  CheckCircle,
  Circle,
  Filter,
  Loader2,
} from "lucide-react";
import type { Permission } from "@/types/role";

interface PermissionSelectorProps {
  selectedPermissions: number[];
  onPermissionsChange: (permissions: number[]) => void;
  disabled?: boolean;
}

const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onPermissionsChange,
  disabled = false,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Mock permissions data - replace with actual API call
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual service
        const mockPermissions: Permission[] = [
          {
            id: 1,
            name: "View Users",
            code: "users.view",
            description: "Can view user list and details",
            resource: "users",
            action: "view",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Create Users",
            code: "users.create",
            description: "Can create new users",
            resource: "users",
            action: "create",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 3,
            name: "Edit Users",
            code: "users.edit",
            description: "Can edit user information",
            resource: "users",
            action: "edit",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 4,
            name: "Delete Users",
            code: "users.delete",
            description: "Can delete users",
            resource: "users",
            action: "delete",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 5,
            name: "View Roles",
            code: "roles.view",
            description: "Can view role list and details",
            resource: "roles",
            action: "view",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 6,
            name: "Create Roles",
            code: "roles.create",
            description: "Can create new roles",
            resource: "roles",
            action: "create",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 7,
            name: "Edit Roles",
            code: "roles.edit",
            description: "Can edit role information",
            resource: "roles",
            action: "edit",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 8,
            name: "Delete Roles",
            code: "roles.delete",
            description: "Can delete roles",
            resource: "roles",
            action: "delete",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 9,
            name: "Manage Permissions",
            code: "permissions.manage",
            description: "Can assign and remove permissions",
            resource: "permissions",
            action: "manage",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 10,
            name: "System Administration",
            code: "system.admin",
            description: "Full system administrative access",
            resource: "system",
            action: "admin",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPermissions(mockPermissions);
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // Filter permissions based on search and resource filter
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResource =
      !resourceFilter || permission.resource === resourceFilter;

    return matchesSearch && matchesResource;
  });

  // Group permissions by resource
  const groupedPermissions = filteredPermissions.reduce(
    (groups, permission) => {
      const resource = permission.resource;
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>
  );

  // Get unique resources for filter
  const resources = Array.from(new Set(permissions.map((p) => p.resource)));

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId];

    onPermissionsChange(newSelected);
  };

  const handleSelectAllInResource = (resourcePermissions: Permission[]) => {
    const resourceIds = resourcePermissions.map((p) => p.id);
    const allSelected = resourceIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      // Deselect all in resource
      onPermissionsChange(
        selectedPermissions.filter((id) => !resourceIds.includes(id))
      );
    } else {
      // Select all in resource
      const newSelected = [
        ...new Set([...selectedPermissions, ...resourceIds]),
      ];
      onPermissionsChange(newSelected);
    }
  };

  const getResourceDisplayName = (resource: string) => {
    return resource.charAt(0).toUpperCase() + resource.slice(1);
  };

  const getActionColor = (action: string) => {
    const colors = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      manage: "bg-purple-100 text-purple-800",
      admin: "bg-gray-100 text-gray-800",
    };
    return colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          disabled={disabled}
        >
          <option value="">All Resources</option>
          {resources.map((resource) => (
            <option key={resource} value={resource}>
              {getResourceDisplayName(resource)}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          disabled={disabled}
        >
          <Filter className="h-4 w-4 mr-1" />
          {showAll ? "Group" : "List"}
        </Button>
      </div>

      {/* Selected Permissions Summary */}
      {selectedPermissions.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Selected Permissions ({selectedPermissions.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPermissionsChange([])}
              disabled={disabled}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedPermissions.slice(0, 5).map((permissionId) => {
              const permission = permissions.find((p) => p.id === permissionId);
              return permission ? (
                <Badge
                  key={permissionId}
                  variant="secondary"
                  className="text-xs"
                >
                  {permission.name}
                </Badge>
              ) : null;
            })}
            {selectedPermissions.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedPermissions.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Permissions List */}
      <div className="border rounded-lg max-h-96 overflow-y-auto">
        {showAll ? (
          // Flat list view
          <div className="divide-y">
            {filteredPermissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50"
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handlePermissionToggle(permission.id)}
                    disabled={disabled}
                    className="mt-1"
                  >
                    {selectedPermissions.includes(permission.id) ? (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </h4>
                      <Badge
                        className={`text-xs ${getActionColor(
                          permission.action
                        )}`}
                      >
                        {permission.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {permission.description}
                    </p>
                    <code className="text-xs text-gray-400 font-mono">
                      {permission.code}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grouped view
          <div className="divide-y">
            {Object.entries(groupedPermissions).map(
              ([resource, resourcePermissions]) => {
                const allSelected = resourcePermissions.every((p) =>
                  selectedPermissions.includes(p.id)
                );
                const someSelected = resourcePermissions.some((p) =>
                  selectedPermissions.includes(p.id)
                );

                return (
                  <div key={resource} className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-600" />
                        <h3 className="font-medium text-gray-900">
                          {getResourceDisplayName(resource)}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {resourcePermissions.length} permissions
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleSelectAllInResource(resourcePermissions)
                        }
                        disabled={disabled}
                        className={`text-xs ${
                          allSelected ? "text-red-600" : "text-blue-600"
                        }`}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {resourcePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            !disabled && handlePermissionToggle(permission.id)
                          }
                        >
                          {selectedPermissions.includes(permission.id) ? (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">
                                {permission.name}
                              </span>
                              <Badge
                                className={`text-xs ${getActionColor(
                                  permission.action
                                )}`}
                              >
                                {permission.action}
                              </Badge>
                            </div>
                            {permission.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Key className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">
            No permissions found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default PermissionSelector;
