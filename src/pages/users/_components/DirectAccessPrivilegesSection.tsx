import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  KeyRound,
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  Calendar,
  Users,
  ShieldPlus,
} from "lucide-react";
import { useUserDetail } from "@/hooks/useUserDetail";
import { userDetailService } from "@/services/userDetailService";
import type {
  Application,
  ApplicationPermission,
  MenuPermission,
} from "@/types/userDetail";
import { toast } from "sonner";

interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  menu_id?: number;
  is_checked: boolean;
}

interface Menu {
  id: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
  permissions: Permission[];
}

const DirectAccessPrivilegesSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;

  const {
    userDetailData,
    isLoading: userLoading,
    refreshUserDetail,
  } = useUserDetail(userId);

  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearchApp, setActiveSearchApp] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applications: any[] = userDetailData?.available_applications || [];
  const directApplications =
    userDetailData?.direct_privileges?.applications || [];
  const directPermissions =
    userDetailData?.direct_privileges?.permissions || [];

  // Initialize selected items based on current direct privileges
  useEffect(() => {
    if (userDetailData) {
      const appIds = directApplications.map((app) => app.application_id);
      const permIds = directPermissions.map((perm) => perm.permission_id);

      setSelectedApps(appIds);
      setSelectedPerms(permIds);
    }
  }, [userDetailData]);

  const toggleApp = async (appId: number): Promise<void> => {
    if (!userId) return;

    const isCurrentlySelected = selectedApps.includes(appId);

    try {
      setIsProcessing(true);
      setError(null);

      const action = isCurrentlySelected ? "revoke" : "grant";

      const response = await userDetailService.managePrivileges(userId, {
        action,
        type: "application",
        target_id: appId,
        expires_at: expiration || undefined,
        notes: notes || undefined,
      });

      if (response.success) {
        toast.success(`Application access ${action}d successfully`);
        await refreshUserDetail();
      } else {
        const errorMsg = response.errors
          ? Object.values(response.errors).flat().join(", ")
          : `Failed to ${action} application access`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Error managing application access:", err);
      const errorMsg = "Failed to manage application access";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePerm = async (permId: number): Promise<void> => {
    if (!userId) return;

    const isCurrentlySelected = selectedPerms.includes(permId);

    try {
      setIsProcessing(true);
      setError(null);

      const action = isCurrentlySelected ? "revoke" : "grant";

      const response = await userDetailService.managePrivileges(userId, {
        action,
        type: "permission",
        target_id: permId,
        expires_at: expiration || undefined,
        notes: notes || undefined,
      });

      if (response.success) {
        toast.success(`Permission ${action}d successfully`);
        await refreshUserDetail();
      } else {
        const errorMsg = response.errors
          ? Object.values(response.errors).flat().join(", ")
          : `Failed to ${action} permission`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Error managing permission:", err);
      const errorMsg = "Failed to manage permission";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      view: "bg-blue-100 text-blue-800",
      create: "bg-green-100 text-green-800",
      edit: "bg-yellow-100 text-yellow-800",
      delete: "bg-red-100 text-red-800",
      access: "bg-purple-100 text-purple-800",
      export: "bg-orange-100 text-orange-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const getIcon = (iconName?: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      calendar: <Calendar className="h-4 w-4" />,
      users: <Users className="h-4 w-4" />,
      default: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
          />
        </svg>
      ),
    };
    return icons[iconName || "default"] || icons.default;
  };

  const totalSelectedPermissions: number = selectedPerms.length;
  const totalSelectedApplications: number = selectedApps.length;

  const clearAllSelections = async (): Promise<void> => {
    if (!userId) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Revoke all selected applications
      for (const appId of selectedApps) {
        await userDetailService.managePrivileges(userId, {
          action: "revoke",
          type: "application",
          target_id: appId,
        });
      }

      // Revoke all selected permissions
      for (const permId of selectedPerms) {
        await userDetailService.managePrivileges(userId, {
          action: "revoke",
          type: "permission",
          target_id: permId,
        });
      }

      toast.success("All privileges cleared successfully");
      await refreshUserDetail();
    } catch (err) {
      console.error("Error clearing privileges:", err);
      const errorMsg = "Failed to clear all privileges";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setNotes(event.target.value);
  };

  const handleExpirationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setExpiration(event.target.value);
  };

  const handleSearch = (appId: number): void => {
    setActiveSearchApp(appId);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(event.target.value);
  };

  const handleSearchCancel = (): void => {
    setActiveSearchApp(null);
    setSearchQuery("");
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
  };

  const filterPermissions = (permissions: Permission[]): Permission[] => {
    if (!searchQuery.trim()) return permissions;

    return permissions.filter(
      (perm) =>
        perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (perm.description &&
          perm.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  if (userLoading) {
    return (
      <div className="border border-purple-200 rounded-lg bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShieldPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Direct Access Privileges
              </h3>
              <p className="text-sm text-gray-600">
                Grant specific application and menu access to this user
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-gray-700 font-medium">
              Loading privileges...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetailData?.user) {
    return (
      <div className="border border-purple-200 rounded-lg bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShieldPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Direct Access Privileges
              </h3>
              <p className="text-sm text-gray-600">
                Grant specific application and menu access to this user
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load user information.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-purple-200 rounded-lg bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShieldPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Direct Access Privileges
              </h3>
              <p className="text-sm text-gray-600">
                Grant specific application and menu access to this user
              </p>
            </div>
          </div>
          <ChevronDown
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Summary and Clear Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-medium text-purple-700">
              {totalSelectedApplications + totalSelectedPermissions} items
              selected
            </div>
            {(totalSelectedApplications > 0 ||
              totalSelectedPermissions > 0) && (
              <button
                onClick={clearAllSelections}
                disabled={isProcessing}
                className="text-xs text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Clearing..." : "Clear all selections"}
              </button>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <Alert
              variant="default"
              className="border-green-200 bg-green-50 mb-6"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Applications Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Available Applications ({applications.length})
              </h4>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="font-medium text-lg">No applications available</p>
                <p className="text-sm mt-1">
                  Applications will appear here when loaded
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Application Header */}
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app.id)}
                          onChange={() => toggleApp(app.id)}
                          disabled={isProcessing}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {getIcon(app.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">
                            {app.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{app.code}
                          </div>
                          {app.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {app.description}
                            </div>
                          )}
                        </div>
                        {activeSearchApp === app.id ? (
                          <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={handleSearchInputChange}
                              placeholder="Search permissions..."
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm w-48"
                              autoFocus
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleSearchCancel}
                              className="p-1"
                            >
                              ✕
                            </Button>
                          </form>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => handleSearch(app.id)}
                            disabled={isProcessing}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Application Content */}
                    <ScrollArea className="p-4 space-y-4 h-[300px]">
                      {/* Application Level Permissions */}
                      {app.permissions.length > 0 && (
                        <div className="border-l-4 border-purple-200 pl-4">
                          <div className="text-sm font-medium mb-3 flex items-center gap-2 text-purple-700">
                            Application Permissions ({app.permissions.length})
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {filterPermissions(app.permissions).map(
                              (perm: Permission) => (
                                <label
                                  key={perm.id}
                                  className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg cursor-pointer border border-transparent hover:border-purple-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedPerms.includes(perm.id)}
                                    onChange={() => togglePerm(perm.id)}
                                    disabled={isProcessing}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {perm.name}
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                                          perm.action
                                        )}`}
                                      >
                                        {perm.action}
                                      </span>
                                      {perm.is_checked && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          Via Role
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {perm.code}
                                      {perm.description &&
                                        ` • ${perm.description}`}
                                    </div>
                                  </div>
                                </label>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Menu Permissions */}
                      {app.menus.map((menu: Menu) => (
                        <div
                          key={menu.id}
                          className="border-l-4 border-indigo-200 pl-4"
                        >
                          <div className="text-sm font-medium mb-3 flex items-center gap-2 text-indigo-700">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                            {menu.name} ({menu.permissions.length} permissions)
                          </div>
                          {menu.permissions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                              {filterPermissions(menu.permissions).map(
                                (perm: Permission) => (
                                  <label
                                    key={perm.id}
                                    className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg cursor-pointer border border-transparent hover:border-indigo-200"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPerms.includes(perm.id)}
                                      onChange={() => togglePerm(perm.id)}
                                      disabled={isProcessing}
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                          {perm.name}
                                        </span>
                                        <span
                                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                                            perm.action
                                          )}`}
                                        >
                                          {perm.action}
                                        </span>
                                        {perm.is_checked && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Via Role
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {perm.code}
                                        {perm.description &&
                                          ` • ${perm.description}`}
                                      </div>
                                    </div>
                                  </label>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                              No permissions available for this menu
                            </p>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                ))}
              </div>
            )}

            {/* Advanced Settings */}
            <div className="space-y-6 border-t pt-6">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Advanced Settings
              </h4>

              {/* Expiration Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expiration}
                    onChange={handleExpirationChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty for permanent access. Expired privileges are
                    automatically deactivated.
                  </p>
                </div>
              </div>

              {/* Administrative Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administrative Notes
                </label>
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Document why this user needs direct access (e.g., temporary project, special assignment, etc.)"
                  rows={4}
                  maxLength={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>
                    Good documentation helps with security audits and compliance
                  </span>
                  <span
                    className={
                      notes.length > 900 ? "text-orange-600 font-medium" : ""
                    }
                  >
                    {notes.length}/1000
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            {(totalSelectedApplications > 0 ||
              totalSelectedPermissions > 0) && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Selected Privileges Summary
                </div>
                <div className="text-sm text-green-700 mb-3">
                  <strong>{totalSelectedApplications}</strong> applications •{" "}
                  <strong>{totalSelectedPermissions}</strong> permissions
                  {expiration && (
                    <span>
                      {" "}
                      • Expires on{" "}
                      <strong>
                        {new Date(expiration).toLocaleDateString()}
                      </strong>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedApps.map((appId: number) => {
                    const app = applications.find((a: any) => a.id === appId);
                    return app ? (
                      <span
                        key={appId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {app.name}
                      </span>
                    ) : null;
                  })}
                  {selectedPerms.slice(0, 5).map((permId: number) => {
                    const permission = applications
                      .flatMap((app) => [
                        ...app.permissions,
                        ...app.menus.flatMap((menu: Menu) => menu.permissions),
                      ])
                      .find((perm) => perm.id === permId);
                    return permission ? (
                      <span
                        key={permId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        {permission.action}
                      </span>
                    ) : null;
                  })}
                  {selectedPerms.length > 5 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      +{selectedPerms.length - 5} more permissions
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Security Best Practices */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-2">Security Best Practices:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>
                      Apply principle of least privilege - grant only necessary
                      access
                    </li>
                    <li>
                      Set expiration dates for temporary access requirements
                    </li>
                    <li>
                      Document clear business justification in administrative
                      notes
                    </li>
                    <li>Review and audit direct privileges regularly</li>
                    <li>
                      Consider creating new roles for common access patterns
                      instead
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectAccessPrivilegesSection;
