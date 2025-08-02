import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Globe,
  Plus,
  X,
  CheckCircle,
  Circle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { Application } from "@/types/role";

interface ApplicationSelectorProps {
  selectedApplications: number[];
  onApplicationsChange: (applications: number[]) => void;
  disabled?: boolean;
}

const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({
  selectedApplications,
  onApplicationsChange,
  disabled = false,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock applications data - replace with actual API call
  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual service
        const mockApplications: Application[] = [
          {
            id: 1,
            name: "User Management System",
            code: "user_mgmt",
            description: "Complete user management and authentication system",
            url: "https://users.example.com",
            icon: "users",
            is_active: true,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 2,
            name: "Content Management",
            code: "cms",
            description: "Content creation and management platform",
            url: "https://cms.example.com",
            icon: "file-text",
            is_active: true,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 3,
            name: "Analytics Dashboard",
            code: "analytics",
            description: "Business intelligence and reporting dashboard",
            url: "https://analytics.example.com",
            icon: "bar-chart",
            is_active: true,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 4,
            name: "E-commerce Platform",
            code: "ecommerce",
            description: "Online store and inventory management",
            url: "https://shop.example.com",
            icon: "shopping-cart",
            is_active: true,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 5,
            name: "Support Ticketing",
            code: "support",
            description: "Customer support and ticketing system",
            url: "https://support.example.com",
            icon: "help-circle",
            is_active: true,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 6,
            name: "Legacy System",
            code: "legacy",
            description: "Deprecated legacy application",
            url: "https://legacy.example.com",
            icon: "archive",
            is_active: false,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-12-01T00:00:00Z",
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        setApplications(mockApplications);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Filter applications based on search
  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate active and inactive applications
  const activeApplications = filteredApplications.filter(
    (app) => app.is_active
  );
  const inactiveApplications = filteredApplications.filter(
    (app) => !app.is_active
  );

  const handleApplicationToggle = (applicationId: number) => {
    const newSelected = selectedApplications.includes(applicationId)
      ? selectedApplications.filter((id) => id !== applicationId)
      : [...selectedApplications, applicationId];

    onApplicationsChange(newSelected);
  };

  const handleSelectAllActive = () => {
    const activeIds = activeApplications.map((app) => app.id);
    const allActiveSelected = activeIds.every((id) =>
      selectedApplications.includes(id)
    );

    if (allActiveSelected) {
      // Deselect all active
      onApplicationsChange(
        selectedApplications.filter((id) => !activeIds.includes(id))
      );
    } else {
      // Select all active
      const newSelected = [...new Set([...selectedApplications, ...activeIds])];
      onApplicationsChange(newSelected);
    }
  };

  const getAppIcon = (iconName: string) => {
    // Return a simple globe icon for now, could be enhanced with actual icons
    return <Globe className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Control */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      {/* Selected Applications Summary */}
      {selectedApplications.length > 0 && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-900">
              Selected Applications ({selectedApplications.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onApplicationsChange([])}
              disabled={disabled}
              className="text-indigo-600 hover:text-indigo-800"
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
                +{selectedApplications.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Active Applications */}
      {activeApplications.length > 0 && (
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Active Applications</h3>
              <Badge variant="outline" className="text-xs">
                {activeApplications.length} available
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllActive}
              disabled={disabled}
              className="text-xs text-blue-600"
            >
              {activeApplications.every((app) =>
                selectedApplications.includes(app.id)
              )
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          <div className="divide-y max-h-64 overflow-y-auto">
            {activeApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  !disabled && handleApplicationToggle(application.id)
                }
              >
                {selectedApplications.includes(application.id) ? (
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}

                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  {getAppIcon(application.icon || "globe")}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {application.name}
                    </h4>
                    <Badge className="text-xs bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {application.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-gray-400 font-mono">
                      @{application.code}
                    </code>
                    {application.url && (
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Applications */}
      {inactiveApplications.length > 0 && (
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <h3 className="font-medium text-gray-700">
                Inactive Applications
              </h3>
              <Badge variant="outline" className="text-xs">
                {inactiveApplications.length} inactive
              </Badge>
            </div>
          </div>

          <div className="divide-y max-h-32 overflow-y-auto">
            {inactiveApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center gap-3 p-3 opacity-60"
              >
                <Circle className="h-4 w-4 text-gray-300" />

                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  {getAppIcon(application.icon || "globe")}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-600">
                      {application.name}
                    </h4>
                    <Badge className="text-xs bg-red-100 text-red-700">
                      Inactive
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {application.description}
                  </p>
                  <code className="text-xs text-gray-400 font-mono">
                    @{application.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <p className="font-medium mb-1">About Application Access:</p>
        <ul className="space-y-1">
          <li>• Select applications this role should have access to</li>
          <li>• Only active applications can be assigned</li>
          <li>
            • Users with this role will inherit these application permissions
          </li>
          <li>• Application-specific permissions are managed separately</li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationSelector;
