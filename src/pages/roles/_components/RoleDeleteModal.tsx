import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
  Key,
  Crown,
} from "lucide-react";
import type { Role } from "@/types/role";

interface RoleDeleteModalProps {
  role: Role | null;
  open: boolean;
  onClose: () => void;
  onDeleteRole: (roleId: number) => Promise<void>;
}

const RoleDeleteModal: React.FC<RoleDeleteModalProps> = ({
  role,
  open,
  onClose,
  onDeleteRole,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setConfirmationText("");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  if (!role) return null;

  const expectedConfirmation = role.code;
  const isConfirmationValid = confirmationText === expectedConfirmation;

  // Handle form submission
  const handleDelete = async () => {
    if (!isConfirmationValid) {
      setError(
        "Please type the role code exactly as shown to confirm deletion."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onDeleteRole(role.id);
      setSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to delete role");
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
            Delete Role
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the role
            and remove all associated permissions.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          // Success State
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Role Deleted Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The role has been permanently removed from the system.
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
                <strong>Warning:</strong> This action is permanent and cannot be
                undone. All role data will be lost.
              </AlertDescription>
            </Alert>

            {/* Role Information */}
            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {role.is_admin ? (
                    <Crown className="h-5 w-5" />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">
                    {role.name}
                    {role.is_admin && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        Admin Role
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-blue-700">@{role.code}</p>
                  {role.description && (
                    <p className="text-sm text-blue-600 mt-1">
                      {role.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {role.users_count || 0} users
                    </span>
                    <span className="flex items-center gap-1">
                      <Key className="h-3 w-3" />
                      {role.permissions_count || 0} permissions
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                        role.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {role.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Warning */}
            {role.users_count && role.users_count > 0 && (
              <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Users Assigned Warning
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      This role is currently assigned to {role.users_count} user
                      {role.users_count > 1 ? "s" : ""}. Deleting this role will
                      remove it from all users and may affect their access
                      permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Role Warning */}
            {role.is_admin && (
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
                <div className="flex items-start gap-2">
                  <Crown className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Admin Role Warning
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      This is an administrative role with elevated privileges.
                      Deleting it may affect system administration capabilities.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Impact Warning */}
            <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
              <h5 className="text-sm font-medium text-yellow-800 mb-2">
                What will be deleted:
              </h5>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Role definition and configuration</li>
                <li>• All permission assignments</li>
                <li>• User role associations</li>
                <li>• Application access configurations</li>
                <li>• Role-based menu permissions</li>
              </ul>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm font-medium">
                Type{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                  {expectedConfirmation}
                </code>{" "}
                to confirm deletion:
              </Label>
              <Input
                id="confirmation"
                type="text"
                placeholder={`Type "${expectedConfirmation}" here`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                disabled={loading}
                className={`${
                  confirmationText && !isConfirmationValid
                    ? "border-red-500"
                    : ""
                } ${isConfirmationValid ? "border-green-500" : ""}`}
                autoComplete="off"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-xs text-red-600">
                  Role code doesn't match. Please type exactly:{" "}
                  <strong>{expectedConfirmation}</strong>
                </p>
              )}
              {isConfirmationValid && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Confirmation verified
                </p>
              )}
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
                    Delete Role
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

export default RoleDeleteModal;
