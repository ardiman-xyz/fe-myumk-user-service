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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Menu,
  Hash,
  FileText,
  Link,
  ArrowUpDown,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";

interface MenuData {
  id: number;
  application_id: number;
  parent_id?: number | null;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

interface MenuFormData {
  name: string;
  code: string;
  description: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  parent_id: string; // Changed to string to work with Select
}

interface ValidationErrors {
  name?: string;
  code?: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order?: string;
  parent_id?: string;
}

interface MenuEditModalProps {
  menu: MenuData | null;
  open: boolean;
  onClose: () => void;
  onUpdateMenu: (menuId: number, data: any) => Promise<void>;
  parentMenus?: MenuData[];
  applicationId: number;
}

const MenuEditModal: React.FC<MenuEditModalProps> = ({
  menu,
  open,
  onClose,
  onUpdateMenu,
  parentMenus = [],
  applicationId,
}) => {
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    code: "",
    description: "",
    url: "",
    icon: "menu",
    sort_order: 1,
    is_active: true,
    parent_id: "none", // Default to "none" instead of null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && menu) {
      setFormData({
        name: menu.name || "",
        code: menu.code || "",
        description: menu.description || "",
        url: menu.url || "",
        icon: menu.icon || "menu",
        sort_order: menu.sort_order || 1,
        is_active: menu.is_active ?? true,
        parent_id: menu.parent_id ? menu.parent_id.toString() : "none",
      });
      setErrors({});
      setSuccess(false);
    }
  }, [open, menu]);

  if (!menu) return null;

  // Available parent menus (exclude current menu and its descendants)
  const availableParentMenus = parentMenus.filter(
    (parentMenu) =>
      parentMenu.id !== menu.id && parentMenu.parent_id !== menu.id
  );

  // Icon options
  const iconOptions = [
    { value: "menu", label: "Menu" },
    { value: "home", label: "Home" },
    { value: "settings", label: "Settings" },
    { value: "users", label: "Users" },
    { value: "dashboard", label: "Dashboard" },
    { value: "reports", label: "Reports" },
    { value: "analytics", label: "Analytics" },
    { value: "calendar", label: "Calendar" },
    { value: "mail", label: "Mail" },
    { value: "folder", label: "Folder" },
  ];

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Menu name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Menu name must not exceed 100 characters";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Menu code is required";
    } else if (!/^[a-z0-9_]+$/.test(formData.code)) {
      newErrors.code =
        "Menu code must contain only lowercase letters, numbers, and underscores";
    } else if (formData.code.length < 2) {
      newErrors.code = "Menu code must be at least 2 characters";
    } else if (formData.code.length > 50) {
      newErrors.code = "Menu code must not exceed 50 characters";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Description must not exceed 255 characters";
    }

    if (formData.url) {
      try {
        new URL(formData.url);
      } catch {
        if (!formData.url.startsWith("/") && !formData.url.startsWith("#")) {
          newErrors.url = "URL must be a valid URL or start with / or #";
        }
      }
    }

    if (formData.sort_order < 1) {
      newErrors.sort_order = "Sort order must be at least 1";
    } else if (formData.sort_order > 999) {
      newErrors.sort_order = "Sort order must not exceed 999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof MenuFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const generateCodeFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
  };

  const handleNameChange = (value: string) => {
    handleInputChange("name", value);

    if (
      !formData.code ||
      formData.code === generateCodeFromName(formData.name)
    ) {
      handleInputChange("code", generateCodeFromName(value));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert form data for API
      const submitData = {
        ...formData,
        parent_id:
          formData.parent_id === "none" ? null : parseInt(formData.parent_id),
      };

      await onUpdateMenu(menu.id, submitData);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ name: error.message || "Failed to update menu" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Edit className="h-5 w-5" />
            Edit Menu
          </DialogTitle>
          <DialogDescription>
            Update the menu configuration. Changes will affect the menu
            structure and user navigation.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Menu Updated Successfully
              </h3>
              <p className="text-sm text-gray-600">
                The menu has been updated with the new configuration.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Menu Info */}
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Menu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">{menu.name}</h4>
                  <p className="text-sm text-blue-700 font-mono">
                    @{menu.code}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-blue-600">ID: {menu.id}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        menu.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {menu.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Menu Name */}
              <div>
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Menu Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter menu name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={loading}
                  className={
                    errors.name ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Menu Code and Sort Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="code"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Hash className="h-4 w-4" />
                    Menu Code *
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="menu_code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    disabled={loading}
                    className={
                      errors.code ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.code && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.code}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Lowercase letters, numbers, and underscores only
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="sort_order"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort Order *
                  </Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="1"
                    max="999"
                    placeholder="1"
                    value={formData.sort_order}
                    onChange={(e) =>
                      handleInputChange(
                        "sort_order",
                        parseInt(e.target.value) || 1
                      )
                    }
                    disabled={loading}
                    className={
                      errors.sort_order
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {errors.sort_order && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.sort_order}
                    </p>
                  )}
                </div>
              </div>

              {/* Parent Menu and Icon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Layers className="h-4 w-4" />
                    Parent Menu
                  </Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) =>
                      handleInputChange("parent_id", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger
                      className={errors.parent_id ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select parent menu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        No Parent (Root Menu)
                      </SelectItem>
                      {availableParentMenus.map((parentMenu) => (
                        <SelectItem
                          key={parentMenu.id}
                          value={parentMenu.id.toString()}
                        >
                          {parentMenu.name} (@{parentMenu.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.parent_id && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.parent_id}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Menu className="h-4 w-4" />
                    Icon
                  </Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => handleInputChange("icon", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* URL */}
              <div>
                <Label
                  htmlFor="url"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Link className="h-4 w-4" />
                  URL
                </Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com or /path or #section"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  disabled={loading}
                  className={
                    errors.url ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {errors.url && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.url}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Full URL, relative path (/path), or anchor (#section)
                </p>
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Enter menu description (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={loading}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/255 characters
                </p>
              </div>

              {/* Active Status */}
              <div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    {formData.is_active ? (
                      <Eye className="h-5 w-5 text-green-600" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <Label className="font-medium text-gray-900">
                        Menu Status
                      </Label>
                      <p className="text-sm text-gray-600">
                        {formData.is_active
                          ? "Menu is visible to users"
                          : "Menu is hidden from users"}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        handleInputChange("is_active", e.target.checked)
                      }
                      disabled={loading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors above before saving the menu.
                </AlertDescription>
              </Alert>
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
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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

export default MenuEditModal;
