// src/pages/permissions/_components/PermissionListTable.tsx
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
  Key,
  Loader2,
  Copy,
  Tag,
  Activity,
} from "lucide-react";
import type { Permission } from "@/types/permission";

interface PermissionListTableProps {
  permissions: Permission[];
  selectedPermissions: number[];
  loading?: boolean;
  onSelectPermission: (permissionId: number) => void;
  onSelectAll: () => void;
  onPermissionAction: (action: string, permissionId: number) => void;
}

const PermissionListTable: React.FC<PermissionListTableProps> = ({
  permissions,
  selectedPermissions,
  loading = false,
  onSelectPermission,
  onSelectAll,
  onPermissionAction,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActionColor = (action: string) => {
    const colors = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      manage: "bg-purple-100 text-purple-800",
      admin: "bg-gray-100 text-gray-800",
      approve: "bg-indigo-100 text-indigo-800",
      publish: "bg-orange-100 text-orange-800",
    };
    return colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getResourceIcon = (resource: string) => {
    // Simple icon mapping based on resource name
    if (resource.includes("user")) return "👤";
    if (resource.includes("role")) return "🛡️";
    if (resource.includes("permission")) return "🔐";
    if (resource.includes("application")) return "📱";
    if (resource.includes("menu")) return "📋";
    if (resource.includes("setting")) return "⚙️";
    if (resource.includes("report")) return "📊";
    if (resource.includes("log")) return "📝";
    return "🔧";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">Loading permissions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No permissions found</h3>
            <p className="text-sm">
              Try adjusting your filters or create a new permission.
            </p>
            <Link to="/permissions/create" className="mt-4 inline-block">
              <Button>Add First Permission</Button>
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
                    selectedPermissions.length === permissions.length &&
                    permissions.length > 0
                  }
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => onSelectPermission(permission.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                      <Key className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {permission.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {permission.code}
                      </p>
                      {permission.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getResourceIcon(permission.resource)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {permission.resource}
                      </p>
                      <p className="text-xs text-gray-500">
                        {permission.resource.split(".").length > 1
                          ? "Hierarchical"
                          : "Simple"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                      permission.action
                    )}`}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    {permission.action}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {permission.roles_count || 0} roles
                    </span>
                    <span className="flex items-center gap-1">
                      <Key className="h-3 w-3" />
                      {permission.users_count || 0} users
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(permission.created_at)}
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
                          Permission Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() =>
                            onPermissionAction("view", permission.id)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onPermissionAction("edit", permission.id)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Permission
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onPermissionAction("duplicate", permission.id)
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Permission
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onPermissionAction("delete", permission.id)
                          }
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Permission
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

export default PermissionListTable;
