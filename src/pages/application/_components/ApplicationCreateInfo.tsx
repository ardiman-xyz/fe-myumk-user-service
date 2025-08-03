import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Info,
  Globe,
  Code,
  FileText,
  Copy,
  Settings,
  ExternalLink,
  CheckCircle,
  Zap,
  Shield,
  Menu,
  Upload,
  Smile,
} from "lucide-react";

interface ApplicationQuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

interface ApplicationCreateInfoProps {
  onQuickAction?: (actionId: string) => void;
}

// Application creation guidelines
const APPLICATION_FORM_GUIDELINES = {
  name: [
    "Use descriptive names that clearly identify the application's purpose",
    "Avoid technical jargon or abbreviations that others might not understand",
    "Keep names concise but meaningful (e.g., 'User Management System')",
    "Use title case for better readability",
  ],
  code: [
    "Use lowercase letters, numbers, and underscores only",
    "Must be unique across all applications in the system",
    "Keep it short but recognizable (e.g., 'user_mgmt', 'cms')",
    "Cannot be changed after creation for system integrity",
  ],
  url: [
    "Use full URLs including protocol (https://)",
    "Ensure the URL is accessible to users who will use this application",
    "Test the URL before saving to avoid broken links",
    "Leave empty if the application has no web interface",
  ],
  icon: [
    "Choose icons that visually represent the application's function",
    "Icons help users quickly identify applications in navigation",
    "Consider the application's primary purpose when selecting",
    "Use consistent icon styles across related applications",
  ],
  general: [
    "Start with inactive status during testing and configuration",
    "Add a clear description to help other administrators",
    "Configure roles and permissions after creating the application",
    "Test application integration before activating for users",
  ],
  nextSteps: [
    "Configure application roles and permissions",
    "Set up menu structure and navigation",
    "Test application access with different user roles",
    "Document application configuration for future reference",
    "Train users on how to access and use the application",
  ],
};

const ApplicationCreateInfo: React.FC<ApplicationCreateInfoProps> = ({
  onQuickAction,
}) => {
  const quickActions: ApplicationQuickAction[] = [
    {
      id: "import-config",
      label: "Import Configuration",
      description: "Import application settings from JSON template",
      icon: "Upload",
      action: () => onQuickAction?.("import-config"),
    },
    {
      id: "duplicate-existing",
      label: "Duplicate Existing App",
      description: "Copy settings from an existing application",
      icon: "Copy",
      action: () => onQuickAction?.("duplicate-existing"),
    },
    {
      id: "app-templates",
      label: "Use App Template",
      description: "Start with predefined application templates",
      icon: "Template",
      action: () => onQuickAction?.("app-templates"),
    },
    {
      id: "integration-guide",
      label: "Integration Guide",
      description: "View documentation for application integration",
      icon: "FileText",
      action: () => onQuickAction?.("integration-guide"),
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Upload: <Upload className="h-4 w-4" />,
      Copy: <Copy className="h-4 w-4" />,
      Template: <Smile className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />,
      ExternalLink: <ExternalLink className="h-4 w-4" />,
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
            Application Creation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Application Name Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Application Name Best Practices:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {APPLICATION_FORM_GUIDELINES.name.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Code Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Application Code Requirements:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {APPLICATION_FORM_GUIDELINES.code.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* URL Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Application URL Guidelines:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {APPLICATION_FORM_GUIDELINES.url.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Icon Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              Icon Selection Tips:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {APPLICATION_FORM_GUIDELINES.icon.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-purple-500 mt-1">•</span>
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
              {APPLICATION_FORM_GUIDELINES.general.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Application Types Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-indigo-600" />
            Application Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <h5 className="text-xs font-medium text-blue-800">
                  External Applications
                </h5>
              </div>
              <p className="text-xs text-blue-700">
                Web applications with their own interfaces. Users will be
                redirected to the application URL when accessing.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="h-4 w-4 text-green-600" />
                <h5 className="text-xs font-medium text-green-800">
                  Internal Applications
                </h5>
              </div>
              <p className="text-xs text-green-700">
                Applications integrated within this system. Users access
                features through internal navigation.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-purple-600" />
                <h5 className="text-xs font-medium text-purple-800">
                  Administrative Applications
                </h5>
              </div>
              <p className="text-xs text-purple-700">
                System management and configuration tools. Usually restricted to
                administrative roles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Zap className="h-4 w-4 text-yellow-600" />
            Integration Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">
                Single Sign-On (SSO)
              </h5>
              <p className="text-xs text-yellow-700">
                Configure applications to use the central authentication system
                for seamless user experience.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h5 className="text-xs font-medium text-green-800 mb-1">
                Role-Based Access
              </h5>
              <p className="text-xs text-green-700">
                Set up proper role assignments to control which users can access
                the application.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-xs font-medium text-blue-800 mb-1">
                Menu Integration
              </h5>
              <p className="text-xs text-blue-700">
                Configure navigation menus to provide easy access points for
                users within the system.
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
            After Application Creation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Next Steps:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {APPLICATION_FORM_GUIDELINES.nextSteps.map((step, index) => (
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

      {/* Common Application Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Common Application Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-3">
              <p>
                Consider these common application patterns for your
                organization:
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2 border rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <div className="font-medium text-gray-900">
                    User Management
                  </div>
                </div>
                <div className="text-gray-600">
                  User registration, profile management, authentication
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-3 w-3 text-green-600" />
                  <div className="font-medium text-gray-900">
                    Content Management
                  </div>
                </div>
                <div className="text-gray-600">
                  Create, edit, and publish content across platforms
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Menu className="h-3 w-3 text-purple-600" />
                  <div className="font-medium text-gray-900">
                    Analytics Dashboard
                  </div>
                </div>
                <div className="text-gray-600">
                  Business intelligence and reporting interface
                </div>
              </div>

              <div className="p-2 border rounded text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="h-3 w-3 text-orange-600" />
                  <div className="font-medium text-gray-900">
                    Third-party Integration
                  </div>
                </div>
                <div className="text-gray-600">
                  External services like CRM, support systems
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-red-600" />
            Security Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <h5 className="text-xs font-medium text-red-800 mb-1">
                URL Validation
              </h5>
              <p className="text-xs text-red-700">
                Ensure application URLs are trusted and secure. Avoid
                redirecting users to untrusted domains.
              </p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h5 className="text-xs font-medium text-orange-800 mb-1">
                Access Control
              </h5>
              <p className="text-xs text-orange-700">
                Configure proper role-based access to prevent unauthorized
                application usage.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">
                Testing Phase
              </h5>
              <p className="text-xs text-yellow-700">
                Start with inactive status and thoroughly test before making
                applications available to users.
              </p>
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
                If you need assistance creating applications or configuring
                integrations, check our resources:
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                📚 Application Management Guide
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                🔗 Integration Documentation
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

export default ApplicationCreateInfo;
