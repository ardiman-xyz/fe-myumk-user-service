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
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  Key,
  Copy,
  Crown,
  UserCheck,
} from "lucide-react";
import type { Role } from "@/types/role";

interface RoleListTableProps {
  roles: Role[];
  selectedRoles: number[];
  loading?: boolean;
  onSelectRole: (roleId: number) => void;
  onSelectAll: () => void;
  onRoleAction: (action: string, roleId: number) => void;
}

const RoleListTable: React.FC<RoleListTableProps> = ({
  roles,
  selectedRoles,
  loading = false,
  onSelectRole,
  onSelectAll,
  onRoleAction,
}) => {
  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getRoleTypeBadge = (role: Role) => {
    return role.is_admin ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <Crown className="h-3 w-3 mr-1" />
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <UserCheck className="h-3 w-3 mr-1" />
        User
      </span>
    );
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
            <span className="ml-2 text-gray-600">Loading roles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (roles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No roles found</h3>
            <p className="text-sm">
              Try adjusting your filters or create a new role.
            </p>
            <Link to="/roles/create" className="mt-4 inline-block">
              <Button>Add First Role</Button>
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
                    selectedRoles.length === roles.length && roles.length > 0
                  }
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => onSelectRole(role.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                      {role.is_admin ? (
                        <Crown className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {role.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{role.code}
                      </p>
                      {role.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{getRoleTypeBadge(role)}</TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(role.is_active)}
                    <span className="text-sm text-gray-900">
                      {role.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {role.users_count || 0}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Key className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {role.permissions_count || 0}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(role.created_at)}
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
                        <DropdownMenuLabel>Role Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => onRoleAction("view", role.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRoleAction("edit", role.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onRoleAction("permissions", role.id)}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRoleAction("users", role.id)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onRoleAction("toggle-status", role.id)}
                          className={
                            role.is_active
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {role.is_active ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate Role
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate Role
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRoleAction("duplicate", role.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Role
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onRoleAction("delete", role.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Role
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

export default RoleListTable;
