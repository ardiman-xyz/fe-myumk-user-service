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
  Key, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Copy,
  RefreshCw,
  Check
} from 'lucide-react';
import { z, ZodError } from 'zod';
import type { User } from '@/services/userService';
import { toast } from 'sonner';

// Password validation schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onResetPassword: (userId: number, password: string) => Promise<void>;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  open,
  onClose,
  onResetPassword
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generateMode, setGenerateMode] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [isCopied, setIsCopied] = useState(false);


  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
      setGenerateMode(false);
      setGeneratedPassword('');
      setIsCopied(false); 
    }
  }, [open]);

  // Generate random secure password
  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let newPassword = '';
    
    // Ensure at least one character from each required set
    newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      newPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    const shuffled = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setGeneratedPassword(shuffled);
    setPassword(shuffled);
    setConfirmPassword(shuffled);
    setGenerateMode(true);
  };

  // Copy password to clipboard
const copyToClipboard = async (text: string) => {
  if (isCopied) return; // Mencegah spam klik

  try {
    await navigator.clipboard.writeText(text);
    setIsCopied(true); // Update state untuk memicu re-render
    toast.success('Password copied to clipboard!')

    // Setelah 1 detik, kembalikan state ke semula
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);

  } catch (err) {
    console.error('Failed to copy password:', err);
  }
};

  // Validate form
  const validateForm = () => {
    try {
      passwordSchema.parse({ password, confirmPassword });
      setError('');
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.issues[0]?.message || 'Validation failed');
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await onResetPassword(user.id, password);
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Reset password for <span className="font-medium">{user.first_name} {user.last_name}</span> (@{user.username})
          </DialogDescription>
        </DialogHeader>

        {success ? (
          // Success State
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Password Reset Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The user's password has been updated. They can now log in with the new password.
              </p>
            </div>
          </div>
        ) : (
          // Form State
          <div className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Password Option */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Generate Secure Password</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                disabled={loading}
              >
                Generate
              </Button>
            </div>

            {/* Generated Password Display */}
            {generateMode && generatedPassword && (
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Generated Password:</p>
                    <code className="text-sm font-mono text-green-800 bg-green-100 px-2 py-1 rounded">
                      {generatedPassword}
                    </code>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                     onClick={() => copyToClipboard(generatedPassword)}
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                    disabled={isCopied} 
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-600" /> 
                    ) : (
                      <Copy className="h-4 w-4" />  
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Make sure to securely share this password with the user.
                </p>
              </div>
            )}

            {/* Manual Password Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Password Requirements:</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Minimum 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least one lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least one number
                </li>
              </ul>
            </div>
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
                onClick={handleSubmit}
                disabled={loading || !password || !confirmPassword}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
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

export default ResetPasswordModal;