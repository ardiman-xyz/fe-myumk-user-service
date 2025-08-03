import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, Key, Calendar, Settings } from "lucide-react";
import type { PermissionFilters } from "@/types/permission";
import { permissionService } from "@/services/permissionService";

interface PermissionListFiltersProps {
  filters: PermissionFilters;
  onFiltersChange: (filters: PermissionFilters) => void;
  loading?: boolean;
}

const PermissionListFilters: React.FC<PermissionListFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resources, setResources] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);

  // Load resources and actions for filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [resourcesResponse, actionsResponse] = await Promise.all([
          permissionService.getUniqueResources(),
          permissionService.getUniqueActions(),
        ]);

        if (resourcesResponse.success && resourcesResponse.data) {
          setResources(resourcesResponse.data);
        }

        if (actionsResponse.success && actionsResponse.data) {
          setActions(actionsResponse.data);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    loadFilterOptions();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch]);

  const handleResourceChange = (resource: string) => {
    onFiltersChange({
      ...filters,
      resource: resource as any,
      page: 1,
    });
  };

  const handleActionChange = (action: string) => {
    onFiltersChange({
      ...filters,
      action: action as any,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({
      ...filters,
      sort_by: sortBy as any,
      sort_order: sortOrder,
      page: 1,
    });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFiltersChange({
      search: "",
      resource: "",
      action: "",
      sort_by: "created_at",
      sort_order: "desc",
      per_page: 15,
      page: 1,
    });
  };

  const hasActiveFilters =
    localSearch ||
    filters.resource ||
    filters.action ||
    filters.sort_by !== "created_at" ||
    filters.sort_order !== "desc";

  return (
    <div className="space-y-3">
      {/* Basic Filters */}
      <div className="flex gap-3 items-center bg-white p-3 rounded-lg border">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search permissions by name, code, resource, or action..."
            className="pl-10 h-9"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            disabled={loading}
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setLocalSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Resource Filter */}
        <select
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm h-9 min-w-[140px]"
          value={filters.resource || ""}
          onChange={(e) => handleResourceChange(e.target.value)}
          disabled={loading}
        >
          <option value="">All Resources</option>
          {resources.map((resource) => (
            <option key={resource} value={resource}>
              {resource}
            </option>
          ))}
        </select>

        {/* Action Filter */}
        <select
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm h-9 min-w-[120px]"
          value={filters.action || ""}
          onChange={(e) => handleActionChange(e.target.value)}
          disabled={loading}
        >
          <option value="">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>

        {/* Advanced Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={showAdvanced ? "bg-blue-50 border-blue-300" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Advanced Filters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Sort By
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.sort_by || "created_at"}
                onChange={(e) =>
                  handleSortChange(e.target.value, filters.sort_order || "desc")
                }
                disabled={loading}
              >
                <option value="created_at">Created Date</option>
                <option value="name">Permission Name</option>
                <option value="code">Permission Code</option>
                <option value="resource">Resource</option>
                <option value="action">Action</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Order</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.sort_order || "desc"}
                onChange={(e) =>
                  handleSortChange(
                    filters.sort_by || "created_at",
                    e.target.value as "asc" | "desc"
                  )
                }
                disabled={loading}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Key className="h-3 w-3" />
                Per Page
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.per_page || 15}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    per_page: parseInt(e.target.value),
                    page: 1,
                  })
                }
                disabled={loading}
              >
                <option value="10">10 items</option>
                <option value="15">15 items</option>
                <option value="25">25 items</option>
                <option value="50">50 items</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">
                Quick Filters
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.action === "view" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleActionChange(filters.action === "view" ? "" : "view")
                }
              >
                View Permissions
              </Button>
              <Button
                variant={filters.action === "create" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleActionChange(
                    filters.action === "create" ? "" : "create"
                  )
                }
              >
                Create Permissions
              </Button>
              <Button
                variant={filters.action === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleActionChange(filters.action === "edit" ? "" : "edit")
                }
              >
                Edit Permissions
              </Button>
              <Button
                variant={filters.action === "delete" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleActionChange(
                    filters.action === "delete" ? "" : "delete"
                  )
                }
              >
                Delete Permissions
              </Button>
              <Button
                variant={
                  filters.sort_by === "name" && filters.sort_order === "asc"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handleSortChange("name", "asc")}
              >
                Alphabetical
              </Button>
              <Button
                variant={
                  filters.sort_by === "created_at" &&
                  filters.sort_order === "desc"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handleSortChange("created_at", "desc")}
              >
                Newest First
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Active filters:</span>
          {localSearch && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Search: "{localSearch}"
            </span>
          )}
          {filters.resource && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              Resource: {filters.resource}
            </span>
          )}
          {filters.action && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Action: {filters.action}
            </span>
          )}
          {(filters.sort_by !== "created_at" ||
            filters.sort_order !== "desc") && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
              Sort: {filters.sort_by} ({filters.sort_order})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionListFilters;
