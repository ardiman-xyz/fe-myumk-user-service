import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Shield,
  Crown,
  Users,
  Key,
  Loader,
  AlertCircle,
} from "lucide-react";
import { roleService } from "@/services/roleService";

interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_admin: boolean;
  is_active: boolean;
  users_count?: number;
  permissions_count?: number;
  applications_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface RoleSelectorProps {
  selectedRoles: number[];
  onRolesChange: (roleIds: number[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  placeholder?: string;
  error?: string;
  maxSelection?: number;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoles,
  onRolesChange,
  disabled = false,
  multiple = true,
  placeholder = "Search and select roles...",
  error,
  maxSelection,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Mock data - ganti dengan API call
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await roleService.getRoles();
      console.info("Fetched roles:", response);
      setRoles(response.data || []);
      setIsLoading(false);
    } catch (error) {
      setLoadError("Failed to load roles");
      setIsLoading(false);
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRoleObjects = roles.filter((role) =>
    selectedRoles.includes(role.id)
  );

  const handleRoleToggle = (roleId: number) => {
    if (disabled) return;

    let newSelection: number[];

    if (multiple) {
      if (selectedRoles.includes(roleId)) {
        newSelection = selectedRoles.filter((id) => id !== roleId);
      } else {
        if (maxSelection && selectedRoles.length >= maxSelection) {
          return; // Don't add if max reached
        }
        newSelection = [...selectedRoles, roleId];
      }
    } else {
      newSelection = selectedRoles.includes(roleId) ? [] : [roleId];
      setIsOpen(false); // Close dropdown for single select
    }

    onRolesChange(newSelection);
  };

  const handleClearAll = () => {
    onRolesChange([]);
  };

  console.info("Selected roles:", roles);

  const getRoleIcon = (role: Role) => {
    if (role.is_admin) {
      return <Crown className="h-4 w-4 text-purple-600" />;
    }
    return <Shield className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-2">
      {/* Selected Roles Display */}
      {selectedRoles.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Selected {multiple ? "Roles" : "Role"} ({selectedRoles.length})
            </span>
            {multiple && (
              <button
                onClick={handleClearAll}
                disabled={disabled}
                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded disabled:opacity-50"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRoleObjects.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-full"
              >
                {getRoleIcon(role)}
                <span className="text-sm font-medium text-gray-900">
                  {role.name}
                </span>
                {role.is_admin && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                <button
                  onClick={() => handleRoleToggle(role.id)}
                  disabled={disabled}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Trigger */}
      <div className="relative">
        <div
          className={`w-full min-h-[44px] px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
            isOpen
              ? "border-blue-500 ring-1 ring-blue-500"
              : error
              ? "border-red-500"
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Shield className="h-4 w-4 text-gray-400" />
              <span
                className={`text-sm ${
                  selectedRoles.length === 0 ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {selectedRoles.length === 0
                  ? placeholder
                  : multiple
                  ? `${selectedRoles.length} role${
                      selectedRoles.length > 1 ? "s" : ""
                    } selected`
                  : selectedRoleObjects[0]?.name || "Select role"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {maxSelection && multiple && (
                <span className="text-xs text-gray-500">
                  {selectedRoles.length}/{maxSelection}
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <Loader className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Loading roles...</p>
              </div>
            )}

            {/* Error State */}
            {loadError && (
              <div className="p-4">
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{loadError}</span>
                </div>
              </div>
            )}

            {/* Roles List */}
            {!isLoading && !loadError && (
              <div className="max-h-60 overflow-y-auto">
                {filteredRoles.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No roles found</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredRoles.map((role) => {
                      const isSelected = selectedRoles.includes(role.id);
                      const isMaxReached =
                        maxSelection &&
                        selectedRoles.length >= maxSelection &&
                        !isSelected;

                      return (
                        <div
                          key={role.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50 border border-blue-200"
                              : isMaxReached
                              ? "bg-gray-50 cursor-not-allowed opacity-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            !isMaxReached && handleRoleToggle(role.id)
                          }
                        >
                          {/* Checkbox/Radio */}
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>

                          {/* Role Icon */}
                          <div className="flex-shrink-0">
                            {getRoleIcon(role)}
                          </div>

                          {/* Role Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {role.name}
                              </h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  role.is_admin
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {role.is_admin ? "Admin" : "User"}
                              </span>
                              {!role.is_active && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {role.description && (
                              <p className="text-xs text-gray-500 truncate mb-1">
                                {role.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {role.users_count || 0} users
                              </span>
                              <span className="flex items-center gap-1">
                                <Key className="h-3 w-3" />
                                {role.permissions_count || 0} permissions
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Footer Info */}
            {multiple && maxSelection && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                  {maxSelection - selectedRoles.length > 0
                    ? `You can select ${
                        maxSelection - selectedRoles.length
                      } more role${
                        maxSelection - selectedRoles.length > 1 ? "s" : ""
                      }`
                    : "Maximum selection reached"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default RoleSelector;
