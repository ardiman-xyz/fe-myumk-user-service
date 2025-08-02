import React from "react";
import {
  Globe,
  Users,
  Shield,
  Settings,
  FileText,
  BarChart,
  ShoppingCart,
  HelpCircle,
  Database,
  Mail,
  Calendar,
  Image,
  Lock,
  CreditCard,
  Truck,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { CreateApplicationFormData } from "@/types/application";

interface ApplicationPreviewProps {
  applicationData: CreateApplicationFormData;
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({
  applicationData,
}) => {
  // Icon mapping for visual display
  const iconComponents: { [key: string]: React.ReactNode } = {
    globe: <Globe className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
    shield: <Shield className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />,
    "file-text": <FileText className="h-5 w-5" />,
    "bar-chart": <BarChart className="h-5 w-5" />,
    "shopping-cart": <ShoppingCart className="h-5 w-5" />,
    "help-circle": <HelpCircle className="h-5 w-5" />,
    database: <Database className="h-5 w-5" />,
    mail: <Mail className="h-5 w-5" />,
    calendar: <Calendar className="h-5 w-5" />,
    image: <Image className="h-5 w-5" />,
    lock: <Lock className="h-5 w-5" />,
    "credit-card": <CreditCard className="h-5 w-5" />,
    truck: <Truck className="h-5 w-5" />,
  };

  const getIconComponent = (iconName: string) => {
    return iconComponents[iconName] || <Globe className="h-5 w-5" />;
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Application Preview
      </h4>

      {/* Application Card Preview */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-start gap-4">
          {/* Application Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            {applicationData.icon ? (
              getIconComponent(applicationData.icon)
            ) : (
              <Globe className="h-6 w-6" />
            )}
          </div>

          {/* Application Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {applicationData.name || "Application Name"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  @{applicationData.code || "application_code"}
                </p>
                {applicationData.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {applicationData.description}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1 ml-4">
                {getStatusIcon(applicationData.is_active)}
                <span className="text-xs font-medium">
                  {applicationData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Application URL */}
            {applicationData.url && (
              <div className="mt-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <a
                  href={applicationData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 truncate"
                >
                  {applicationData.url}
                </a>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>0 roles assigned</span>
              <span>0 menus configured</span>
              <span>Ready for setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it will appear in Navigation */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">
          How it will appear in navigation:
        </h5>

        {/* Navigation Item Preview */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white">
              {applicationData.icon ? (
                getIconComponent(applicationData.icon)
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {applicationData.name || "Application Name"}
            </span>
            {applicationData.url && (
              <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
            )}
          </div>
        </div>
      </div>

      {/* Application List Preview */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">
          How it will appear in applications list:
        </h5>

        {/* Table Row Preview */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-700">
              <div className="col-span-1">□</div>
              <div className="col-span-4">Application</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Roles</div>
              <div className="col-span-2">URL</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          <div className="px-4 py-3 bg-white">
            <div className="grid grid-cols-12 gap-4 items-center text-sm">
              <div className="col-span-1">
                <input type="checkbox" className="rounded" />
              </div>

              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white">
                    {applicationData.icon ? (
                      getIconComponent(applicationData.icon)
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {applicationData.name || "Application Name"}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{applicationData.code || "application_code"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(applicationData.is_active)}
                  <span className="text-sm">
                    {applicationData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-gray-600">0</span>
              </div>

              <div className="col-span-2">
                {applicationData.url ? (
                  <div className="flex items-center gap-1 text-blue-600">
                    <ExternalLink className="h-3 w-3" />
                    <span className="text-xs truncate">
                      {applicationData.url.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No URL</span>
                )}
              </div>

              <div className="col-span-1">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
        <p className="font-medium text-blue-800 mb-1">Preview Summary:</p>
        <ul className="space-y-1 text-blue-700">
          <li>
            • Application will be{" "}
            {applicationData.is_active
              ? "active and available"
              : "inactive and hidden"}{" "}
            for role assignment
          </li>
          <li>• Icon: {applicationData.icon || "Default globe icon"}</li>
          <li>
            •{" "}
            {applicationData.url
              ? "External URL configured for navigation"
              : "No external URL - internal navigation only"}
          </li>
          <li>
            • Code: @{applicationData.code || "application_code"} (used for API
            and internal references)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationPreview;
