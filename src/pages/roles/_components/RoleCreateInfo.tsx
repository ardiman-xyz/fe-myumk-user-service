import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { ROLE_FORM_GUIDELINES, type RoleQuickAction } from "@/types/role";

interface RoleCreateInfoProps {
  onQuickAction?: (actionId: string) => void;
}

const RoleCreateInfo: React.FC<RoleCreateInfoProps> = ({ onQuickAction }) => {
  const quickActions: RoleQuickAction[] = [
    {
      id: "create-with-permissions",
      label: "Create with Permissions",
      description: "Use a permission template to quick-start",
      icon: "Key",
      action: () => onQuickAction?.("create-with-permissions"),
    },
    {
      id: "duplicate-existing",
      label: "Duplicate Existing Role",
      description: "Copy settings from an existing role",
      icon: "Copy",
      action: () => onQuickAction?.("duplicate-existing"),
    },
    {
      id: "import-template",
      label: "Import Role Template",
      description: "Import role from JSON template",
      icon: "FileText",
      action: () => onQuickAction?.("import-template"),
    },
    {
      id: "role-templates",
      label: "Use Role Template",
      description: "Start with predefined role templates",
      icon: "Settings",
      action: () => onQuickAction?.("role-templates"),
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Key: <Key className="h-4 w-4" />,
      Copy: <Copy className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
    };
    return icons[iconName] || <Settings className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 text-blue-600" />
            Role Creation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Name Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Role Name Best Practices:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {ROLE_FORM_GUIDELINES.name.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Role Code Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Role Code Requirements:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {ROLE_FORM_GUIDELINES.code.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permission Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Permission Assignment:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {ROLE_FORM_GUIDELINES.permissions.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* General Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              General Rules:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {ROLE_FORM_GUIDELINES.general.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Role Types Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Crown className="h-4 w-4 text-purple-600" />
            Role Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4 text-purple-600" />
                <h5 className="text-xs font-medium text-purple-800">
                  Admin Roles
                </h5>
              </div>
              <p className="text-xs text-purple-700">
                Administrative roles with elevated system privileges. Use
                carefully and assign only to trusted users.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <h5 className="text-xs font-medium text-blue-800">
                  User Roles
                </h5>
              </div>
              <p className="text-xs text-blue-700">
                Standard user roles with limited permissions. Suitable for most
                users and specific job functions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-green-600" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h5 className="text-xs font-medium text-green-800 mb-1">
                Principle of Least Privilege
              </h5>
              <p className="text-xs text-green-700">
                Grant only the minimum permissions necessary for users to
                perform their job functions.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-xs font-medium text-blue-800 mb-1">
                Regular Review
              </h5>
              <p className="text-xs text-blue-700">
                Periodically review role permissions and remove unnecessary
                access to maintain security.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">
                Documentation
              </h5>
              <p className="text-xs text-yellow-700">
                Document role purposes and responsibilities for better
                management and compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle className="h-4 w-4 text-green-600" />
            After Role Creation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Next Steps:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {ROLE_FORM_GUIDELINES.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
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

      {/* Common Role Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Common Role Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-3">
              <p>Consider these common role patterns for your organization:</p>
            </div>

            <div className="space-y-2">
              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">Administrator</div>
                <div className="text-gray-600">
                  Full system access and user management
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">Manager</div>
                <div className="text-gray-600">
                  Team oversight and reporting access
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">Editor</div>
                <div className="text-gray-600">
                  Content creation and modification rights
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">Viewer</div>
                <div className="text-gray-600">
                  Read-only access to designated areas
                </div>
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
                If you need assistance creating roles or configuring
                permissions, check our resources:
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
                💬 Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleCreateInfo;
