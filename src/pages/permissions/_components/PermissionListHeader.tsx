import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Key, Plus, Download, FileText, Zap } from "lucide-react";

interface PermissionListHeaderProps {
  totalPermissions: number;
  selectedCount: number;
  onExport?: () => void;
  onBulkAction?: (action: string) => void;
}

const PermissionListHeader: React.FC<PermissionListHeaderProps> = ({
  totalPermissions,
  selectedCount,
  onExport,
  onBulkAction,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="h-6 w-6 text-orange-600" />
            Permissions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system permissions and access controls ({totalPermissions}{" "}
            total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Link to="/permissions/create">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Permission
            </Button>
          </Link>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-800">
                {selectedCount} permission{selectedCount > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction?.("export-selected")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Export Selected
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onBulkAction?.("delete")}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Quick Actions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/permissions/create?type=crud">
              <Button variant="outline" size="sm">
                Generate CRUD Permissions
              </Button>
            </Link>
            <Link to="/permissions/create?type=batch">
              <Button variant="outline" size="sm">
                Batch Create
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionListHeader;
