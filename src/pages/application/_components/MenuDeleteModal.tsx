import React, { useState, useEffect } from "react";
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
  Menu,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

interface MenuData {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  parent_id?: number;
  url?: string;
  sort_order: number;
}

interface MenuHierarchy {
  id: number;
  name: string;
  code: string;
  level: number;
  is_active: boolean;
  children: MenuHierarchy[];
}

interface DeleteStats {
  menu: MenuData;
  total_children: number;
  direct_children: MenuData[];
  has_children: boolean;
  children_list: MenuHierarchy[];
}

interface MenuDeleteModalProps {
  menu: MenuData | null;
  open: boolean;
  onClose: () => void;
  onDeleteMenu: (menuId: number) => Promise<void>;
  onGetDeleteStats?: (menuId: number) => Promise<DeleteStats>;
}

const MenuDeleteModal: React.FC<MenuDeleteModalProps> = ({
  menu,
  open,
  onClose,
  onDeleteMenu,
  onGetDeleteStats,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteStats, setDeleteStats] = useState<DeleteStats | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && menu) {
      setConfirmationText("");
      setError("");
      setSuccess(false);
      setDeleteStats(null);
      setExpandedItems(new Set());

      if (onGetDeleteStats) {
        loadDeleteStats();
      } else {
        // Create basic stats if no API call
        setDeleteStats({
          menu,
          total_children: 0,
          direct_children: [],
          has_children: false,
          children_list: [],
        });
      }
    }
  }, [open, menu]);

  const loadDeleteStats = async () => {
    if (!menu || !onGetDeleteStats) return;

    setLoadingStats(true);
    try {
      const stats = await onGetDeleteStats(menu.id);
      setDeleteStats(stats);

      // Auto expand first level if there are children
      if (stats.has_children) {
        setExpandedItems(new Set([menu.id]));
      }
    } catch (error: any) {
      setError("Failed to load menu information");
      console.error("Error loading delete stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!menu) return null;

  const expectedConfirmation = menu.code;
  const isConfirmationValid = confirmationText === expectedConfirmation;

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderChildrenHierarchy = (
    children: MenuHierarchy[],
    level: number = 0
  ) => {
    return children.map((child) => (
      <div key={child.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div className="flex items-center gap-2 py-1">
          {child.children.length > 0 ? (
            <button
              onClick={() => toggleExpanded(child.id)}
              className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
            >
              {expandedItems.has(child.id) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <div className="w-4 flex-shrink-0" />
          )}

          <Menu className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium">{child.name}</span>
          <span className="text-xs text-gray-500">@{child.code}</span>

          {child.is_active ? (
            <Eye className="h-3 w-3 text-green-500" />
          ) : (
            <EyeOff className="h-3 w-3 text-red-500" />
          )}

          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              child.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {child.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {child.children.length > 0 && expandedItems.has(child.id) && (
          <div className="ml-4 border-l border-gray-200 pl-2">
            {renderChildrenHierarchy(child.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const handleDelete = async () => {
    if (!isConfirmationValid) {
      setError(
        "Please type the menu code exactly as shown to confirm deletion."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onDeleteMenu(menu.id);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to delete menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Menu
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the menu
            {deleteStats?.has_children ? " and all its sub-menus" : ""}.
          </DialogDescription>
        </DialogHeader>

        {loadingStats ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading menu information...</p>
          </div>
        ) : success ? (
          <div className="py-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Menu Deleted Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The menu
                {deleteStats?.has_children ? " and all its sub-menus" : ""}
                {deleteStats?.has_children && deleteStats.total_children > 0
                  ? ` (${deleteStats.total_children} sub-menu${
                      deleteStats.total_children !== 1 ? "s" : ""
                    })`
                  : ""}{" "}
                have been permanently removed.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
                undone.
                {deleteStats?.has_children &&
                  deleteStats.total_children > 0 && (
                    <>
                      {" "}
                      All {deleteStats.total_children} sub-menu
                      {deleteStats.total_children !== 1 ? "s" : ""} will also be
                      deleted.
                    </>
                  )}
              </AlertDescription>
            </Alert>

            {/* Menu Information */}
            {deleteStats && (
              <>
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <Menu className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-blue-900 text-lg">
                        {deleteStats.menu.name}
                      </h4>
                      <p className="text-sm text-blue-700 font-mono">
                        @{deleteStats.menu.code}
                      </p>
                      {deleteStats.menu.description && (
                        <p className="text-sm text-blue-600 mt-1">
                          {deleteStats.menu.description}
                        </p>
                      )}
                      {deleteStats.menu.url && (
                        <p className="text-xs text-blue-500 mt-1 font-mono">
                          URL: {deleteStats.menu.url}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Menu className="h-4 w-4" />
                          {deleteStats.total_children} sub-menu
                          {deleteStats.total_children !== 1 ? "s" : ""}
                        </span>
                        <span className="text-blue-500">
                          Order: #{deleteStats.menu.sort_order}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            deleteStats.menu.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {deleteStats.menu.is_active ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-menus Warning */}
                {deleteStats.has_children && deleteStats.total_children > 0 && (
                  <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-orange-800 mb-2">
                          Sub-menus Will Be Deleted
                        </h5>
                        <p className="text-sm text-orange-700 mb-3">
                          This menu has{" "}
                          <strong>{deleteStats.total_children}</strong> sub-menu
                          {deleteStats.total_children !== 1 ? "s" : ""}
                          that will also be permanently deleted. This includes
                          all nested sub-menus.
                        </p>

                        {/* Sub-menus List */}
                        <div className="bg-white rounded-lg border p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="text-xs font-medium text-gray-700">
                              Sub-menus to be deleted:
                            </h6>
                            <span className="text-xs text-gray-500">
                              {deleteStats.total_children} item
                              {deleteStats.total_children !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                            {deleteStats.children_list.length > 0 ? (
                              renderChildrenHierarchy(deleteStats.children_list)
                            ) : (
                              <p className="text-xs text-gray-500 italic">
                                No sub-menus found
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Impact Warning */}
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <h5 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    What will be permanently deleted:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                        Menu definition and configuration
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                        All permission assignments
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                        Role-menu associations
                      </li>
                    </ul>
                    {deleteStats.has_children &&
                      deleteStats.total_children > 0 && (
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                            All {deleteStats.total_children} sub-menu
                            {deleteStats.total_children !== 1 ? "s" : ""}
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                            Sub-menu permissions
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                            Nested menu configurations
                          </li>
                        </ul>
                      )}
                  </div>
                </div>

                {/* Confirmation Input */}
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="confirmation"
                      className="text-sm font-medium text-gray-700"
                    >
                      To confirm deletion, type{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 font-semibold">
                        {expectedConfirmation}
                      </code>{" "}
                      below:
                    </Label>
                  </div>
                  <Input
                    id="confirmation"
                    type="text"
                    placeholder={`Type "${expectedConfirmation}" here`}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    disabled={loading}
                    className={`${
                      confirmationText && !isConfirmationValid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    } ${
                      isConfirmationValid
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                        : ""
                    }`}
                    autoComplete="off"
                  />
                  {confirmationText && !isConfirmationValid && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Menu code doesn't match. Please type exactly:{" "}
                      <strong>{expectedConfirmation}</strong>
                    </p>
                  )}
                  {isConfirmationValid && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Confirmation verified - ready to delete
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          {success ? (
            <Button onClick={onClose} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Close
            </Button>
          ) : (
            <div className="flex gap-3 w-full">
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
                disabled={loading || !isConfirmationValid || loadingStats}
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
                    Delete Menu
                    {deleteStats?.has_children &&
                      deleteStats.total_children > 0 && (
                        <span className="ml-1">
                          & {deleteStats.total_children} Sub-menu
                          {deleteStats.total_children !== 1 ? "s" : ""}
                        </span>
                      )}
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

export default MenuDeleteModal;
