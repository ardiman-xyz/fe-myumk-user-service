import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Plus, 
  Download,
  FileText,
  Settings
} from 'lucide-react';

interface UserListHeaderProps {
  totalUsers: number;
  selectedCount: number;
  onExport?: () => void;
  onBulkAction?: (action: string) => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({
  totalUsers,
  selectedCount,
  onExport,
  onBulkAction
}) => {
  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Users
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system users ({totalUsers} total)
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
          
          <Link to="/users/create">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">
                {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkAction?.('assign-role')}
            >
              <Settings className="h-4 w-4 mr-1" />
              Assign Role
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkAction?.('deactivate')}
            >
              Deactivate
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkAction?.('export-selected')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Export Selected
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onBulkAction?.('delete')}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListHeader;