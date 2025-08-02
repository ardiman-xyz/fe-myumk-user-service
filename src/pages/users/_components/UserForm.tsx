import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff,
  Loader2,
  Save,
  Rocket
} from 'lucide-react';
import { 
  createUserSchema, 
  UserFormValidator, 
  type CreateUserFormData
} from '@/types/user';

interface UserFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateUserFormData>;
  mode?: 'create' | 'edit';
}

interface FormErrors {
  [key: string]: string;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_active: true,
    ...initialData
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback((fieldName: keyof CreateUserFormData, value: any) => {
  const error = UserFormValidator.validateField(fieldName, value, formData, mode);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof CreateUserFormData;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [fieldName]: newValue
    }));

    // Validate field if it has been touched
    if (touchedFields.has(fieldName)) {
      validateField(fieldName, newValue);
    }

    // Special case: if password changes, revalidate confirmPassword
    if (fieldName === 'password' && touchedFields.has('confirmPassword')) {
      const confirmPasswordError = formData.confirmPassword !== newValue 
        ? "Passwords don't match" 
        : null;
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError;
        } else {
          delete newErrors.confirmPassword;
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof CreateUserFormData;
    setTouchedFields(prev => new Set(prev).add(fieldName));
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData) as Array<keyof CreateUserFormData>;
    setTouchedFields(new Set(allFields));

    // Validate entire form
    const formErrors = UserFormValidator.validateForm(formData);
    setErrors(formErrors);

    // If no errors, submit
    if (Object.keys(formErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return touchedFields.has(fieldName) ? errors[fieldName] : undefined;
  };

  const isFieldInvalid = (fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                First Name *
              </Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={isFieldInvalid('first_name') ? 'border-red-500' : ''}
                disabled={isLoading}
                aria-invalid={isFieldInvalid('first_name')}
              />
              {getFieldError('first_name') && (
                <p className="text-sm text-red-600">{getFieldError('first_name')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">
                Last Name *
              </Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={isFieldInvalid('last_name') ? 'border-red-500' : ''}
                disabled={isLoading}
                aria-invalid={isFieldInvalid('last_name')}
              />
              {getFieldError('last_name') && (
                <p className="text-sm text-red-600">{getFieldError('last_name')}</p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                Username *
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={isFieldInvalid('username') ? 'border-red-500' : ''}
                disabled={isLoading}
                aria-invalid={isFieldInvalid('username')}
              />
              {getFieldError('username') && (
                <p className="text-sm text-red-600">{getFieldError('username')}</p>
              )}
              <p className="text-xs text-gray-500">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`pl-10 ${isFieldInvalid('email') ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid('email')}
                />
              </div>
              {getFieldError('email') && (
                <p className="text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`pl-10 ${isFieldInvalid('phone') ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid('phone')}
                />
              </div>
              {getFieldError('phone') && (
                <p className="text-sm text-red-600">{getFieldError('phone')}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`pr-10 ${isFieldInvalid('password') ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {getFieldError('password') && (
                <p className="text-sm text-red-600">{getFieldError('password')}</p>
              )}
              <p className="text-xs text-gray-500">
                Min 8 chars, include uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`pr-10 ${isFieldInvalid('confirmPassword') ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-invalid={isFieldInvalid('confirmPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="text-sm text-red-600">{getFieldError('confirmPassword')}</p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Label htmlFor="is_active" className="text-sm font-normal">
                Active Account
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              Inactive accounts cannot login to the system
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || Object.keys(errors).length > 0}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Create User' : 'Update User'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserForm;