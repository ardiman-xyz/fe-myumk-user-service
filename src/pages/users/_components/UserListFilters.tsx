import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  X,
  Users,
  Calendar,
  Shield
} from 'lucide-react';
import type { UserFilters } from '@/services/userService';

interface UserListFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  loading?: boolean;
}

const UserListFilters: React.FC<UserListFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({ ...filters, search: localSearch, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch]);

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status as 'active' | 'inactive' | '', 
      page: 1 
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sort_by: sortBy as any,
      sort_order: sortOrder,
      page: 1
    });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      status: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      per_page: 15,
      page: 1
    });
  };

  const hasActiveFilters = localSearch || filters.status || filters.sort_by !== 'created_at' || filters.sort_order !== 'desc';

  return (
    <div className="space-y-3">
      {/* Basic Filters */}
      <div className="flex gap-3 items-center bg-white p-3 rounded-lg border">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search users, emails, or usernames..."
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
              onClick={() => setLocalSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <select 
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm h-9 min-w-[120px]"
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Advanced Filter Toggle */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={showAdvanced ? 'bg-blue-50 border-blue-300' : ''}
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
            <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
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
                value={filters.sort_by || 'created_at'}
                onChange={(e) => handleSortChange(e.target.value, filters.sort_order || 'desc')}
                disabled={loading}
              >
                <option value="created_at">Created Date</option>
                <option value="first_name">First Name</option>
                <option value="last_name">Last Name</option>
                <option value="email">Email</option>
                <option value="username">Username</option>
                <option value="last_login_at">Last Login</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Order</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.sort_order || 'desc'}
                onChange={(e) => handleSortChange(filters.sort_by || 'created_at', e.target.value as 'asc' | 'desc')}
                disabled={loading}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Per Page
              </label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.per_page || 15}
                onChange={(e) => onFiltersChange({ ...filters, per_page: parseInt(e.target.value), page: 1 })}
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
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Quick Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.status === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(filters.status === 'active' ? '' : 'active')}
              >
                Active Users
              </Button>
              <Button
                variant={filters.status === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(filters.status === 'inactive' ? '' : 'inactive')}
              >
                Inactive Users
              </Button>
              <Button
                variant={filters.sort_by  ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('last_login_at', 'desc')}
              >
                Recent Login
              </Button>
              <Button
                variant={filters.sort_by === 'created_at' && filters.sort_order === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('created_at', 'desc')}
              >
                Newest Users
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
          {filters.status && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              Status: {filters.status}
            </span>
          )}
          {(filters.sort_by !== 'created_at' || filters.sort_order !== 'desc') && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Sort: {filters.sort_by} ({filters.sort_order})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserListFilters;