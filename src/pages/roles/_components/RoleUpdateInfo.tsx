import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  Shield,
  Key,
  FileText,
  Copy,
  Crown,
  Settings,
  Users,
  CheckCircle,
  Eye,
  History,
  Download,
  Calendar,
  Activity,
  AlertTriangle,
  User,
} from "lucide-react";
import type { Role, RoleQuickAction } from "@/types/role";

interface RoleUpdateInfoProps {
  role: Role | null;
  onQuickAction?: (actionId: string) => void;
}

const RoleUpdateInfo: React.FC<RoleUpdateInfoProps> = ({
  role,
  onQuickAction,
}) => {
  if (!role) return null;

  const quickActions: RoleQuickAction[] = [
    {
      id: "view-details",
      label: "View Role Details",
      description: "See complete role information",
      icon: "Eye",
      action: () => onQuickAction?.("view-details"),
    },
    {
      id: "manage-permissions",
      label: "Manage Permissions",
      description: "Edit role permissions and access",
      icon: "Key",
      action: () => onQuickAction?.("manage-permissions"),
    },
    {
      id: "manage-users",
      label: "Manage Users",
      description: "Assign or remove users from this role",
      icon: "Users",
      action: () => onQuickAction?.("manage-users"),
    },
    {
      id: "duplicate-role",
      label: "Duplicate Role",
      description: "Create a copy of this role",
      icon: "Copy",
      action: () => onQuickAction?.("duplicate-role"),
    },
    {
      id: "role-history",
      label: "View Change History",
      description: "See role modification history",
      icon: "History",
      action: () => onQuickAction?.("role-history"),
    },
    {
      id: "export-role",
      label: "Export Configuration",
      description: "Download role configuration",
      icon: "Download",
      action: () => onQuickAction?.("export-role"),
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Eye: <Eye className="h-4 w-4" />,
      Key: <Key className="h-4 w-4" />,
      Copy: <Copy className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      History: <History className="h-4 w-4" />,
      Download: <Download className="h-4 w-4" />,
    };
    return icons[iconName] || <Settings className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Role Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4 text-green-600" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Status:</span>
              <Badge
                className={
                  role.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {role.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Type:</span>
              <Badge
                className={
                  role.is_admin
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }
              >
                {role.is_admin ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    User
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Users:</span>
              <span className="text-sm font-medium text-gray-900">
                {role.users_count || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Permissions:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {role.permissions_count || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Applications:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {role.applications_count || 0}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-3 border-t border-gray-200">
            <h5 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Timeline
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-700">
                  {formatDate(role.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span className="text-gray-700">
                  {formatDate(role.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 text-blue-600" />
            Update Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-xs font-medium text-blue-800 mb-1">
                Best Practices:
              </h5>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Test changes in a non-production environment first</li>
                <li>• Notify affected users before making changes</li>
                <li>• Document the reason for changes</li>
                <li>• Review impact on existing permissions</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">
                Restrictions:
              </h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Role code cannot be modified after creation</li>
                <li>• Deactivating affects all assigned users</li>
                <li>• Admin role changes require careful consideration</li>
                <li>• Permission changes take effect immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Settings className="h-4 w-4 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={action.action}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(action.icon)}</div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-green-600" />
            Security Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-3">
              <p>Ensure these security principles are followed:</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                <span className="text-xs text-gray-700">
                  Principle of least privilege applied
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                <span className="text-xs text-gray-700">
                  Permissions reviewed and justified
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                <span className="text-xs text-gray-700">
                  Change impact assessed
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                <span className="text-xs text-gray-700">
                  Documentation updated
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              <p>
                If you need assistance updating roles or have questions about
                the impact of changes:
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                📚 Role Management Guide
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                🔐 Security Best Practices
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                📞 Contact System Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleUpdateInfo;
