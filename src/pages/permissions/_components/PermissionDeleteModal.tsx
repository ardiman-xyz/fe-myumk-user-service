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
  Key,
  Tag,
  Users,
  Activity,
} from "lucide-react";
import type { Permission } from "@/types/permission";

interface PermissionDeleteModalProps {
  permission: Permission | null;
  open: boolean;
  onClose: () => void;
  onDeletePermission: (permissionId: number) => Promise<void>;
}

const PermissionDeleteModal: React.FC<PermissionDeleteModalProps> = ({
  permission,
  open,
  onClose,
  onDeletePermission,
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

  if (!permission) return null;

  const expectedConfirmation = permission.code;
  const isConfirmationValid = confirmationText === expectedConfirmation;

  const getActionColor = (action: string) => {
    const colors = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      manage: "bg-purple-100 text-purple-800",
      admin: "bg-gray-100 text-gray-800",
    };
    return colors[action as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Handle form submission
  const handleDelete = async () => {
    if (!isConfirmationValid) {
      setError(
        "Please type the permission code exactly as shown to confirm deletion."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onDeletePermission(permission.id);
      setSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to delete permission");
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
            Delete Permission
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            permission and remove it from all roles that currently have it
            assigned.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          // Success State
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Permission Deleted Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The permission has been permanently removed from the system.
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
                undone. All permission data will be lost.
              </AlertDescription>
            </Alert>

            {/* Permission Information */}
            <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white">
                  <Key className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900">
                    {permission.name}
                  </h4>
                  <p className="text-sm text-orange-700 font-mono">
                    {permission.code}
                  </p>
                  {permission.description && (
                    <p className="text-sm text-orange-600 mt-1">
                      {permission.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-orange-800">
                        Resource:
                      </span>
                      <span className="text-sm text-orange-700">
                        {permission.resource}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                        permission.action
                      )}`}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {permission.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-orange-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {permission.roles_count || 0} roles
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {permission.users_count || 0} users
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Warning */}
            {permission.roles_count && permission.roles_count > 0 && (
              <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Permission In Use Warning
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This permission is currently assigned to{" "}
                      {permission.roles_count} role
                      {permission.roles_count > 1 ? "s" : ""}. Deleting this
                      permission will remove it from all roles and may affect
                      user access permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Impact Warning */}
            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <h5 className="text-sm font-medium text-blue-800 mb-2">
                What will be deleted:
              </h5>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Permission definition and configuration</li>
                <li>• All role assignments for this permission</li>
                <li>• Permission-based access controls</li>
                <li>• Audit logs related to this permission</li>
                <li>• Any application-specific integrations</li>
              </ul>
            </div>

            {/* System Impact */}
            <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
              <h5 className="text-sm font-medium text-purple-800 mb-2">
                System Impact:
              </h5>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Users may lose access to specific features</li>
                <li>• Role permissions will be automatically updated</li>
                <li>
                  • Access control checks will no longer recognize this
                  permission
                </li>
                <li>• This change takes effect immediately</li>
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
                  Permission code doesn't match. Please type exactly:{" "}
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
                    Delete Permission
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

export default PermissionDeleteModal;
