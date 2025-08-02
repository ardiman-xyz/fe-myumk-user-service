import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';
import type { CreateUserFormData, CreateUserRequest } from '@/types/user';
import UserForm from './_components/UserForm';
import UserCreateInfo from './_components/UserCreateInfo';
import { userService } from '@/services/userService';


const AddUserPage: React.FC = () => {
  useTitle('Add User - User Service');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (formData: CreateUserFormData) => {

    console.log('Form Data:', formData);
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...requestData } = formData;
      const apiData: CreateUserRequest = requestData;

      // Call API
      const response = await userService.createUser(apiData);

      if (response.success && response.data) {
        setSuccessMessage(`User "${response.data.full_name}" created successfully!`);
        
        // Show success toast
        toast.success('User created successfully!', {
          description: `${response.data.full_name} has been added to the system.`,
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/users');
        }, 1000);

      } else {
        // Handle API errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setErrorMessage(errorMessages.join(', '));
        } else {
          setErrorMessage(response.message || 'Failed to create user');
        }
        
        toast.error('Failed to create user', {
          description: response.message || 'Please check the form and try again.',
        });
      }

    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMsg = error.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      
      toast.error('Error creating user', {
        description: errorMsg,
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'create-assign-role':
        toast.info('Feature coming soon', {
          description: 'Create & Assign Role feature will be available soon.',
        });
        break;
      case 'bulk-create':
        toast.info('Feature coming soon', {
          description: 'Bulk user creation feature will be available soon.',
        });
        break;
      case 'import-csv':
        toast.info('Feature coming soon', {
          description: 'CSV import feature will be available soon.',
        });
        break;
      case 'templates':
        toast.info('Feature coming soon', {
          description: 'User templates feature will be available soon.',
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/users"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Add New User
            </h1>
            <p className="text-sm text-gray-600">Create a new user account for the system</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/users')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <UserForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            mode="create"
          />
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <UserCreateInfo onQuickAction={handleQuickAction} />
        </div>
      </div>

      {/* Progress Indicator (if needed) */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 font-medium">Creating user...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserPage;