import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Globe,
  X,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Key,
  Menu,
  Shield,
  Users,
  FileText,
  BarChart3,
  ShoppingCart,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { applicationService } from "@/services/applicationService";

interface Application {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  is_active: boolean;
  permissions: Permission[];
  menus: Menu[];
}

interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  menu_id?: number;
}

interface Menu {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  parent_id?: number;
  children?: Menu[];
  permissions: Permission[];
}

interface IntegratedAppPermissionSelectorProps {
  selectedApplications: number[];
  selectedPermissions: number[];
  onApplicationsChange: (applications: number[]) => void;
  onPermissionsChange: (permissions: number[]) => void;
  disabled?: boolean;
}

const IntegratedAppPermissionSelector: React.FC<
  IntegratedAppPermissionSelectorProps
> = ({
  selectedApplications,
  selectedPermissions,
  onApplicationsChange,
  onPermissionsChange,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedApps, setExpandedApps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Load applications on mount
    loadApplication();
  }, []);

  const loadApplication = async () => {
    setLoading(true);
    try {
      // const currentFilters = newFilters || filters;
      const response =
        await applicationService.getActiveApplicationsAndPermission();

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        toast.error(response.message || "Failed to load permissions");
        setApplications([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load permissions");
      console.error("Error loading permissions:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getAppIcon = (iconName: string) => {
    const icons = {
      users: <Users className="h-5 w-5" />,
      "file-text": <FileText className="h-5 w-5" />,
      "bar-chart": <BarChart3 className="h-5 w-5" />,
      "shopping-cart": <ShoppingCart className="h-5 w-5" />,
      "help-circle": <HelpCircle className="h-5 w-5" />,
    };
    return (
      icons[iconName as keyof typeof icons] || <Globe className="h-5 w-5" />
    );
  };

  const getActionColor = (action: string) => {
    const colors = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      access: "bg-purple-100 text-purple-800",
      publish: "bg-indigo-100 text-indigo-800",
      upload: "bg-cyan-100 text-cyan-800",
      export: "bg-orange-100 text-orange-800",
    };
    return colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAppExpanded = (appId: number) => {
    const newExpanded = new Set(expandedApps);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedApps(newExpanded);
  };

  const handleApplicationToggle = (appId: number) => {
    const isSelected = selectedApplications.includes(appId);
    let newSelectedApps: number[];

    if (isSelected) {
      // Remove application and all its permissions
      newSelectedApps = selectedApplications.filter((id) => id !== appId);
      const app = applications.find((a) => a.id === appId);
      if (app) {
        const appPermissionIds = [
          ...app.permissions.map((p) => p.id),
          ...app.menus.flatMap((m) => m.permissions.map((p) => p.id)),
        ];
        const newSelectedPermissions = selectedPermissions.filter(
          (permId) => !appPermissionIds.includes(permId)
        );
        onPermissionsChange(newSelectedPermissions);
      }
    } else {
      // Add application
      newSelectedApps = [...selectedApplications, appId];
    }

    onApplicationsChange(newSelectedApps);
  };

  const handlePermissionToggle = (permissionId: number) => {
    const isSelected = selectedPermissions.includes(permissionId);
    let newSelectedPermissions: number[];

    if (isSelected) {
      newSelectedPermissions = selectedPermissions.filter(
        (id) => id !== permissionId
      );
    } else {
      newSelectedPermissions = [...selectedPermissions, permissionId];
    }

    onPermissionsChange(newSelectedPermissions);
  };

  const handleSelectAllMenuPermissions = (menu: Menu) => {
    const menuPermissionIds = menu.permissions.map((p) => p.id);
    const allSelected = menuPermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    let newSelectedPermissions: number[];
    if (allSelected) {
      // Deselect all menu permissions
      newSelectedPermissions = selectedPermissions.filter(
        (id) => !menuPermissionIds.includes(id)
      );
    } else {
      // Select all menu permissions
      newSelectedPermissions = [
        ...new Set([...selectedPermissions, ...menuPermissionIds]),
      ];
    }

    onPermissionsChange(newSelectedPermissions);
  };

  const getTotalSelectedForApp = (
    app: Application
  ): { selected: number; total: number } => {
    const appPermissionIds = [
      ...app.permissions.map((p) => p.id),
      ...app.menus.flatMap((m) => m.permissions.map((p) => p.id)),
    ];
    const selectedCount = appPermissionIds.filter((id) =>
      selectedPermissions.includes(id)
    ).length;
    return { selected: selectedCount, total: appPermissionIds.length };
  };

  return (
    <div className="space-y-4">
      {/* Search Control */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search applications and permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled={disabled}
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

      {/* Selected Summary */}
      {(selectedApplications.length > 0 || selectedPermissions.length > 0) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Selected: {selectedApplications.length} apps,{" "}
              {selectedPermissions.length} permissions
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onApplicationsChange([]);
                onPermissionsChange([]);
              }}
              disabled={disabled}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedApplications.slice(0, 3).map((appId) => {
              const app = applications.find((a) => a.id === appId);
              return app ? (
                <Badge key={appId} variant="secondary" className="text-xs">
                  {app.name}
                </Badge>
              ) : null;
            })}
            {selectedApplications.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedApplications.length - 3} more apps
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.map((application) => {
          const isAppSelected = selectedApplications.includes(application.id);
          const isExpanded = expandedApps.has(application.id);
          const { selected, total } = getTotalSelectedForApp(application);

          return (
            <div
              key={application.id}
              className={`border rounded-lg ${
                isAppSelected ? "border-blue-300 bg-blue-50" : "border-gray-200"
              }`}
            >
              {/* Application Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleApplicationToggle(application.id)}
                      disabled={disabled}
                      className="flex-shrink-0"
                    >
                      {isAppSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      {getAppIcon(application.icon || "globe")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {application.name}
                        </h4>
                        <Badge className="text-xs bg-green-100 text-green-700">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {application.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-400 font-mono">
                          @{application.code}
                        </code>
                        {isAppSelected && (
                          <span className="text-xs text-blue-600">
                            {selected}/{total} permissions selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isAppSelected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAppExpanded(application.id)}
                      disabled={disabled}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Application Permissions (when selected and expanded) */}
              {isAppSelected && isExpanded && (
                <div className="border-t border-gray-200 bg-white">
                  {/* Application-level Permissions */}
                  {application.permissions.length > 0 && (
                    <div className="p-4 border-b border-gray-100">
                      <h5 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        Application Permissions
                      </h5>
                      <div className="space-y-2">
                        {application.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                          >
                            <button
                              onClick={() =>
                                handlePermissionToggle(permission.id)
                              }
                              disabled={disabled}
                            >
                              {selectedPermissions.includes(permission.id) ? (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
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
                  )}

                  {/* Menu Permissions */}
                  {application.menus.map((menu) => (
                    <div
                      key={menu.id}
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          <Menu className="h-4 w-4 text-indigo-600" />
                          {menu.name}
                          <span className="text-xs text-gray-500 font-normal">
                            ({menu.permissions.length} permissions)
                          </span>
                        </h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAllMenuPermissions(menu)}
                          disabled={disabled}
                          className="text-xs text-blue-600"
                        >
                          {menu.permissions.every((p) =>
                            selectedPermissions.includes(p.id)
                          )
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {menu.permissions.map((permission) => (
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
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">
            No applications found matching your criteria.
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <p className="font-medium mb-1">How it works:</p>
        <ul className="space-y-1">
          <li>• Select applications this role can access</li>
          <li>
            • Expand each application to see available menus and permissions
          </li>
          <li>• Choose specific permissions for granular access control</li>
          <li>
            • Users with this role will inherit these application and permission
            settings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IntegratedAppPermissionSelector;
