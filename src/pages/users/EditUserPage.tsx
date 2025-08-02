import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Users,
  Loader2
} from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';

import { userService, type UpdateUserRequest, type User } from '@/services/userService';
import type { CreateUserFormData } from '@/types/user';
import UserForm from './_components/UserForm';
import UserCreateInfo from './_components/UserCreateInfo';

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || '0');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);

  useTitle(user ? `Edit ${user.first_name} ${user.last_name}` : 'Edit User');

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!userId || isNaN(userId)) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');
        
        const response = await userService.getUserById(userId);
        
        if (response.success && response.data) {
          setUser(response.data);
          setNotFound(false);
        } else {
          setNotFound(true);
          setErrorMessage(response.message || 'User not found');
        }
      } catch (error: any) {
        console.error('Error loading user:', error);
        setNotFound(true);
        setErrorMessage(error.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // Convert User to form data
  const userToFormData = (user: User): CreateUserFormData => {
    return {
      username: user.username,
      email: user.email,
      password: '', // Always empty for edit
      confirmPassword: '', // Always empty for edit
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      is_active: user.is_active,
    };
  };

  // Handle form submission
  const handleFormSubmit = async (formData: CreateUserFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Prepare data for API (remove password fields if empty)
      const { confirmPassword, ...requestData } = formData;
      const apiData: UpdateUserRequest = {};

      // Only include fields that have changed or are not empty
      if (requestData.username !== user.username) {
        apiData.username = requestData.username;
      }
      if (requestData.email !== user.email) {
        apiData.email = requestData.email;
      }
      if (requestData.first_name !== user.first_name) {
        apiData.first_name = requestData.first_name;
      }
      if (requestData.last_name !== user.last_name) {
        apiData.last_name = requestData.last_name;
      }
      if (requestData.phone !== (user.phone || '')) {
        apiData.phone = requestData.phone || undefined;
      }
      if (requestData.is_active !== user.is_active) {
        apiData.is_active = requestData.is_active;
      }
      // Only include password if it's provided
      if (requestData.password && requestData.password.trim() !== '') {
        apiData.password = requestData.password;
      }

      // If no changes, show message
      if (Object.keys(apiData).length === 0) {
        toast.info('No changes detected', {
          description: 'Please make some changes before saving.',
        });
        return;
      }

      // Call API
      const response = await userService.updateUser(userId, apiData);

      if (response.success && response.data) {
        setUser(response.data); // Update local user data
        setSuccessMessage(`User "${response.data.first_name} ${response.data.last_name}" updated successfully!`);
        
        // Show success toast
        toast.success('User updated successfully!', {
          description: `${response.data.first_name} ${response.data.last_name} has been updated.`,
        });

        // Optional: Redirect after a short delay
        setTimeout(() => {
          navigate('/users');
        }, 2000);

      } else {
        // Handle API errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat();
          setErrorMessage(errorMessages.join(', '));
        } else {
          setErrorMessage(response.message || 'Failed to update user');
        }
        
        toast.error('Failed to update user', {
          description: response.message || 'Please check the form and try again.',
        });
      }

    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMsg = error.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      
      toast.error('Error updating user', {
        description: errorMsg,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'create-assign-role':
        toast.info('Feature coming soon', {
          description: 'Assign role feature will be available soon.',
        });
        break;
      case 'reset-password':
        toast.info('Use the password field in the form to change password.');
        break;
      case 'view-activity':
        toast.info('Feature coming soon', {
          description: 'View user activity feature will be available soon.',
        });
        break;
      case 'duplicate-user':
        navigate('/users/add', { 
          state: { 
            duplicateFrom: user,
            prefill: {
              first_name: user?.first_name,
              last_name: user?.last_name,
              phone: user?.phone,
              is_active: user?.is_active
            }
          }
        });
        break;
      default:
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <div className="h-4 w-px bg-gray-300" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link 
            to="/users"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
        </div>

        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">
            {errorMessage || 'The user you are looking for does not exist or has been deleted.'}
          </p>
          <div className="space-x-2">
            <Button onClick={() => navigate('/users')}>
              Go to Users List
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              Edit User
            </h1>
            <p className="text-sm text-gray-600">
              Update information for {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/users')}
            disabled={isSubmitting}
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

      {/* User Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-blue-700">@{user.username} • {user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
              <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
              <span>Last Login: {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                user.is_active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <UserForm
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
            initialData={userToFormData(user)}
            mode="edit"
          />
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <UserCreateInfo onQuickAction={handleQuickAction} />
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900 font-medium">Updating user...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserPage;