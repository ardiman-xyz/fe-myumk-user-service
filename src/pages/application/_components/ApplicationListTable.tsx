import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Menu,
  ExternalLink,
  Copy,
  Zap,
  Settings,
} from "lucide-react";
import type { Application } from "@/types/application";

interface ApplicationListTableProps {
  applications: Application[];
  selectedApplications: number[];
  loading?: boolean;
  onSelectApplication: (applicationId: number) => void;
  onSelectAll: () => void;
  onApplicationAction: (action: string, applicationId: number) => void;
}

const ApplicationListTable: React.FC<ApplicationListTableProps> = ({
  applications,
  selectedApplications,
  loading = false,
  onSelectApplication,
  onSelectAll,
  onApplicationAction,
}) => {
  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getApplicationIcon = (iconName?: string) => {
    // You can expand this to support more icons based on your icon system
    const iconMap: { [key: string]: React.ReactNode } = {
      users: <Shield className="h-5 w-5" />,
      "file-text": <Menu className="h-5 w-5" />,
      "bar-chart": <Settings className="h-5 w-5" />,
      "shopping-cart": <Globe className="h-5 w-5" />,
      "help-circle": <Eye className="h-5 w-5" />,
      archive: <Trash2 className="h-5 w-5" />,
    };

    return iconMap[iconName || "globe"] || <Globe className="h-5 w-5" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading applications...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-sm">
              Try adjusting your filters or create a new application.
            </p>
            <Link to="/applications/create" className="mt-4 inline-block">
              <Button>Add First Application</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedApplications.length === applications.length &&
                    applications.length > 0
                  }
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Application</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Menus</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => onSelectApplication(application.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      {getApplicationIcon(application.icon)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {application.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{application.code}
                      </p>
                      {application.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {application.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.is_active)}
                    <span className="text-sm text-gray-900">
                      {application.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {application.roles_count || 0}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Menu className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {application.menus_count || 0}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  {application.url ? (
                    <button
                      onClick={() =>
                        onApplicationAction("open", application.id)
                      }
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">
                        {application.url.replace(/^https?:\/\//, "")}
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">No URL</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(application.created_at)}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center space-x-1">
                    {/* Dropdown Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          title="More Actions"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>
                          Application Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("view", application.id)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("edit", application.id)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Application
                        </DropdownMenuItem>

                        {application.url && (
                          <DropdownMenuItem
                            onClick={() =>
                              onApplicationAction("open", application.id)
                            }
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Application
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("roles", application.id)
                          }
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Roles
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("menus", application.id)
                          }
                        >
                          <Menu className="mr-2 h-4 w-4" />
                          Manage Menus
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("toggle-status", application.id)
                          }
                          className={
                            application.is_active
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {application.is_active ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate App
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate App
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("duplicate", application.id)
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Application
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onApplicationAction("delete", application.id)
                          }
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationListTable;
