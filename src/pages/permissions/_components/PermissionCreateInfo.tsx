import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Info,
  Key,
  Zap,
  FileText,
  Settings,
  CheckCircle,
  Tag,
  Activity,
  Code,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  PERMISSION_FORM_GUIDELINES,
  type PermissionQuickAction,
} from "@/types/permission";

interface PermissionCreateInfoProps {
  onQuickAction?: (actionId: string) => void;
  currentMode?: "single" | "crud" | "batch";
}

const PermissionCreateInfo: React.FC<PermissionCreateInfoProps> = ({
  onQuickAction,
  currentMode = "single",
}) => {
  const quickActions: PermissionQuickAction[] = [
    {
      id: "single-permission",
      label: "Single Permission",
      description: "Create one custom permission",
      icon: "Key",
      action: () => onQuickAction?.("single-permission"),
    },
    {
      id: "crud-generator",
      label: "CRUD Generator",
      description: "Generate view, create, edit, delete permissions",
      icon: "Zap",
      action: () => onQuickAction?.("crud-generator"),
    },
    {
      id: "batch-create",
      label: "Batch Create",
      description: "Create multiple permissions at once",
      icon: "FileText",
      action: () => onQuickAction?.("batch-create"),
    },
    {
      id: "import-template",
      label: "Import Template",
      description: "Import permissions from JSON template",
      icon: "Settings",
      action: () => onQuickAction?.("import-template"),
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Key: <Key className="h-4 w-4" />,
      Zap: <Zap className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />,
    };
    return icons[iconName] || <Settings className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Current Mode Info */}
      {currentMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              Current Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {currentMode === "crud" && (
                  <Zap className="h-4 w-4 text-blue-600" />
                )}
                {currentMode === "single" && (
                  <Key className="h-4 w-4 text-blue-600" />
                )}
                {currentMode === "batch" && (
                  <FileText className="h-4 w-4 text-blue-600" />
                )}
                <h5 className="text-sm font-medium text-blue-800">
                  {currentMode === "crud" && "CRUD Generator"}
                  {currentMode === "single" && "Single Permission"}
                  {currentMode === "batch" && "Batch Create"}
                </h5>
              </div>
              <p className="text-xs text-blue-700">
                {currentMode === "crud" &&
                  "Generate standard CRUD permissions for a resource"}
                {currentMode === "single" &&
                  "Create one custom permission with specific settings"}
                {currentMode === "batch" &&
                  "Create multiple permissions at once"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 text-orange-600" />
            Permission Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Name Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Name Best Practices:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {PERMISSION_FORM_GUIDELINES.name.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permission Code Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Code className="h-3 w-3" />
              Code Requirements:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {PERMISSION_FORM_GUIDELINES.code.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Resource Naming:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {PERMISSION_FORM_GUIDELINES.resource.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Action Naming:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {PERMISSION_FORM_GUIDELINES.action.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
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
                Create specific permissions rather than broad ones. Users should
                only have access to what they absolutely need.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-xs font-medium text-blue-800 mb-1">
                Clear Naming Convention
              </h5>
              <p className="text-xs text-blue-700">
                Use consistent naming patterns that make it easy to understand
                what each permission controls.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">
                Documentation
              </h5>
              <p className="text-xs text-yellow-700">
                Always include clear descriptions to help administrators
                understand the permission's purpose.
              </p>
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
                variant={
                  currentMode ===
                  action.id.replace("-permission", "").replace("-generator", "")
                    ? "default"
                    : "outline"
                }
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

      {/* Common Permission Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Common Permission Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-3">
              <p>Examples of well-structured permissions:</p>
            </div>

            <div className="space-y-2">
              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">users.view</div>
                <div className="text-gray-600">
                  View Users - Can view user list and profiles
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">
                  blog.posts.publish
                </div>
                <div className="text-gray-600">
                  Publish Blog Posts - Can publish draft posts
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">
                  admin.settings.manage
                </div>
                <div className="text-gray-600">
                  Manage Settings - Full control over system settings
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="font-medium text-gray-900">
                  reports.financial.view
                </div>
                <div className="text-gray-600">
                  View Financial Reports - Access to financial data
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle className="h-4 w-4 text-green-600" />
            After Creating Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Next Steps:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {PERMISSION_FORM_GUIDELINES.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h5 className="text-xs font-medium text-amber-800 mb-1">
                Permission Codes Cannot Be Changed
              </h5>
              <p className="text-xs text-amber-700">
                Once created, permission codes are permanent. Choose carefully
                as they're used throughout the system.
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h5 className="text-xs font-medium text-red-800 mb-1">
                Deletion Restrictions
              </h5>
              <p className="text-xs text-red-700">
                Permissions assigned to roles cannot be deleted until they're
                removed from all roles first.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionCreateInfo;
