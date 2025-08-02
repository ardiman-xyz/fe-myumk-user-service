import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Shield, 
  Users, 
  FileText, 
  Upload,
  UserPlus,
  Settings
} from 'lucide-react';
import { USER_FORM_GUIDELINES, type QuickAction } from '@/types/user';

interface UserInfoSidebarProps {
  onQuickAction?: (actionId: string) => void;
}

const UserCreateInfo: React.FC<UserInfoSidebarProps> = ({ onQuickAction }) => {
  
  const quickActions: QuickAction[] = [
    {
      id: 'create-assign-role',
      label: 'Create & Assign Role',
      description: 'Create user and immediately assign a role',
      icon: 'UserPlus',
      action: () => onQuickAction?.('create-assign-role')
    },
    {
      id: 'bulk-create',
      label: 'Create Multiple Users',
      description: 'Create several users at once',
      icon: 'Users',
      action: () => onQuickAction?.('bulk-create')
    },
    {
      id: 'import-csv',
      label: 'Import from CSV',
      description: 'Upload user data from CSV file',
      icon: 'Upload',
      action: () => onQuickAction?.('import-csv')
    },
    {
      id: 'templates',
      label: 'User Templates',
      description: 'Use predefined user templates',
      icon: 'FileText',
      action: () => onQuickAction?.('templates')
    }
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      UserPlus: <UserPlus className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      Upload: <Upload className="h-4 w-4" />,
      FileText: <FileText className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />
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
            Form Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Username Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {USER_FORM_GUIDELINES.username.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Password Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {USER_FORM_GUIDELINES.password.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* General Guidelines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">General Rules:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {USER_FORM_GUIDELINES.general.map((guideline, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-green-600" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h5 className="text-xs font-medium text-green-800 mb-1">Strong Passwords</h5>
              <p className="text-xs text-green-700">
                Encourage users to use unique, complex passwords and enable 2FA when available.
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="text-xs font-medium text-blue-800 mb-1">Role Assignment</h5>
              <p className="text-xs text-blue-700">
                Follow the principle of least privilege - assign only necessary permissions.
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="text-xs font-medium text-yellow-800 mb-1">Account Review</h5>
              <p className="text-xs text-yellow-700">
                Regularly review user accounts and disable inactive ones.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-orange-600" />
            After User Creation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Next Steps:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {USER_FORM_GUIDELINES.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-orange-500 mt-1">•</span>
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
                  <div className="mt-0.5">
                    {getIcon(action.icon)}
                  </div>
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

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              <p>If you encounter any issues while creating users, check our documentation or contact support.</p>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                📚 View Documentation
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                💬 Contact Support
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                🎥 Watch Tutorial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCreateInfo;