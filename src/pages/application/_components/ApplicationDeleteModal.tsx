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
  Globe,
  Shield,
  Menu,
  ExternalLink,
} from "lucide-react";
import type { Application } from "@/types/application";

interface ApplicationDeleteModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onDeleteApplication: (applicationId: number) => Promise<void>;
}

const ApplicationDeleteModal: React.FC<ApplicationDeleteModalProps> = ({
  application,
  open,
  onClose,
  onDeleteApplication,
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

  if (!application) return null;

  const expectedConfirmation = application.code;
  const isConfirmationValid = confirmationText === expectedConfirmation;

  // Handle form submission
  const handleDelete = async () => {
    if (!isConfirmationValid) {
      setError(
        "Please type the application code exactly as shown to confirm deletion."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onDeleteApplication(application.id);
      setSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to delete application");
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
            Delete Application
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            application and all associated data.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          // Success State
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Application Deleted Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The application has been permanently removed from the system.
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
                undone. All application data will be lost.
              </AlertDescription>
            </Alert>

            {/* Application Information */}
            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">
                    {application.name}
                  </h4>
                  <p className="text-sm text-blue-700">@{application.code}</p>
                  {application.description && (
                    <p className="text-sm text-blue-600 mt-1">
                      {application.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {application.roles_count || 0} roles
                    </span>
                    <span className="flex items-center gap-1">
                      <Menu className="h-3 w-3" />
                      {application.menus_count || 0} menus
                    </span>
                    {application.url && (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        URL configured
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                        application.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {application.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles Warning */}
            {application.roles_count && application.roles_count > 0 && (
              <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Roles Associated Warning
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      This application has {application.roles_count} role
                      {application.roles_count > 1 ? "s" : ""} associated with
                      it. Deleting this application will remove all role
                      associations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menus Warning */}
            {application.menus_count && application.menus_count > 0 && (
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
                <div className="flex items-start gap-2">
                  <Menu className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Menus Associated Warning
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      This application has {application.menus_count} menu
                      {application.menus_count > 1 ? "s" : ""} configured. All
                      menus and navigation structure will be permanently
                      deleted.
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
                <li>• Application configuration and settings</li>
                <li>• All associated menus and navigation structure</li>
                <li>• Role-application associations</li>
                <li>• Application-specific permissions</li>
                <li>• User access configurations</li>
                <li>• Activity logs related to this application</li>
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
                  Application code doesn't match. Please type exactly:{" "}
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
                    Delete Application
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

export default ApplicationDeleteModal;
