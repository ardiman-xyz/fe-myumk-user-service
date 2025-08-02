import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trash2, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserIcon,
  Shield,
  Calendar,
  Mail
} from 'lucide-react';
import type { User } from '@/services/userService';

interface UserDeleteModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onDeleteUser: (userId: number) => Promise<void>;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  user,
  open,
  onClose,
  onDeleteUser
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setConfirmationText('');
      setError('');
      setSuccess(false);
    }
  }, [open]);

  if (!user) return null;

  const expectedConfirmation = user.username;
  const isConfirmationValid = confirmationText === expectedConfirmation;

  // Handle form submission
  const handleDelete = async () => {
    if (!isConfirmationValid) {
      setError('Please type the username exactly as shown to confirm deletion.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onDeleteUser(user.id);
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete User Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user account and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          // Success State
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                User Deleted Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The user account has been permanently removed from the system.
              </p>
            </div>
          </div>
        ) : (
          // Confirmation State
          <div className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Warning Alert */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Warning:</strong> This action is permanent and cannot be undone. All user data will be lost.
              </AlertDescription>
            </Alert>


            {/* Data Impact Warning */}
            <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
              <h5 className="text-sm font-medium text-yellow-800 mb-2">What will be deleted:</h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• User account and profile information</li>
                <li>• Login sessions and authentication tokens</li>
                <li>• User activity logs and audit trails</li>
                <li>• Role assignments and permissions</li>
                <li>• Any user-specific configurations</li>
              </ul>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm font-medium">
                Type <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{expectedConfirmation}</code> to confirm deletion:
              </Label>
              <Input
                id="confirmation"
                type="text"
                placeholder={`Type "${expectedConfirmation}" here`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                disabled={loading}
                className={`${confirmationText && !isConfirmationValid ? 'border-red-500' : ''} ${
                  isConfirmationValid ? 'border-green-500' : ''
                }`}
                autoComplete="off"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-xs text-red-600">
                  Username doesn't match. Please type exactly: <strong>{expectedConfirmation}</strong>
                </p>
              )}
              {isConfirmationValid && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Confirmation verified
                </p>
              )}
            </div>

            {/* Additional Confirmation for Active Users */}
            {user.is_active && (
              <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Active User Warning</p>
                    <p className="text-xs text-orange-700 mt-1">
                      This user is currently active and may be logged in. Deleting will immediately terminate their access.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {success ? (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading || !isConfirmationValid}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteModal;