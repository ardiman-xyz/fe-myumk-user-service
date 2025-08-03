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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MenuIcon,
  Loader2,
  AlertCircle,
  Plus,
  ExternalLink,
  Type,
  Code,
  Hash,
  Image,
} from "lucide-react";
import { menuService, type CreateMenuRequest } from "@/services/menuService";

interface Menu {
  id: number;
  application_id: number;
  parent_id?: number;
  name: string;
  code: string;
  description?: string;
  url?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Menu[];
}

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applicationId: number;
  parentId?: number | null;
  menus: Menu[];
}

interface FormData {
  name: string;
  code: string;
  description: string;
  url: string;
  icon: string;
  sort_order: string;
  parent_id: string;
  is_active: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const MENU_ICONS = [
  { value: "menu", label: "Menu", icon: "☰" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "dashboard", label: "Dashboard", icon: "📊" },
  { value: "users", label: "Users", icon: "👥" },
  { value: "settings", label: "Settings", icon: "⚙️" },
  { value: "file", label: "File", icon: "📄" },
  { value: "folder", label: "Folder", icon: "📁" },
  { value: "chart", label: "Chart", icon: "📈" },
  { value: "calendar", label: "Calendar", icon: "📅" },
  { value: "mail", label: "Mail", icon: "✉️" },
  { value: "bell", label: "Notifications", icon: "🔔" },
  { value: "search", label: "Search", icon: "🔍" },
  { value: "help", label: "Help", icon: "❓" },
  { value: "info", label: "Info", icon: "ℹ️" },
  { value: "star", label: "Star", icon: "⭐" },
  { value: "heart", label: "Heart", icon: "❤️" },
  { value: "bookmark", label: "Bookmark", icon: "🔖" },
  { value: "tag", label: "Tag", icon: "🏷️" },
  { value: "globe", label: "Globe", icon: "🌐" },
  { value: "lock", label: "Lock", icon: "🔒" },
];

const CreateMenuModal: React.FC<CreateMenuModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  applicationId,
  parentId,
  menus,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    description: "",
    url: "",
    icon: "",
    sort_order: "",
    parent_id: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        code: "",
        description: "",
        url: "",
        icon: "menu",
        sort_order: "",
        parent_id: parentId?.toString() || "",
        is_active: true,
      });
      setErrors({});
      setCodeGenerated(false);
    }
  }, [isOpen, parentId]);

  // Auto-generate code from name
  const generateCodeFromName = (name: string) => {
    if (!name || codeGenerated) return "";

    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_|_$/g, "");
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate code when name changes
    if (field === "name" && !codeGenerated && typeof value === "string") {
      const generatedCode = generateCodeFromName(value);
      if (generatedCode) {
        setFormData((prev) => ({ ...prev, code: generatedCode }));
      }
    }

    // Mark code as manually edited
    if (field === "code") {
      setCodeGenerated(true);
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Menu name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Menu code is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.code)) {
      newErrors.code =
        "Menu code can only contain letters, numbers, and underscores";
    }

    if (formData.url && formData.url.trim() && !isValidUrl(formData.url)) {
      newErrors.url = "Please enter a valid URL";
    }

    if (formData.sort_order && isNaN(parseInt(formData.sort_order))) {
      newErrors.sort_order = "Sort order must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const requestData: CreateMenuRequest = {
        application_id: applicationId,
        name: formData.name.trim(),
        code: formData.code.trim().toLowerCase(),
        description: formData.description.trim() || undefined,
        url: formData.url.trim() || undefined,
        icon: formData.icon || undefined,
        is_active: formData.is_active,
      };

      if (formData.parent_id && formData.parent_id !== "none") {
        requestData.parent_id = parseInt(formData.parent_id);
      }

      if (formData.sort_order) {
        requestData.sort_order = parseInt(formData.sort_order);
      }

      const response = await menuService.createMenu(requestData);

      if (response.success) {
        onSuccess();
      } else {
        if (response.errors) {
          setErrors(response.errors as any);
        } else {
          setErrors({ general: response.message || "Failed to create menu" });
        }
      }
    } catch (error: any) {
      console.error("Error creating menu:", error);
      setErrors({ general: error.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // Get parent menu options
  const parentOptions = menus.filter(
    (menu) =>
      menu.application_id === applicationId &&
      (!parentId || menu.id !== parentId)
  );

  const selectedParent = parentId ? menus.find((m) => m.id === parentId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-blue-600" />
            Create New Menu
          </DialogTitle>
          <DialogDescription>
            {selectedParent
              ? `Create a sub-menu under "${selectedParent.name}"`
              : "Create a new menu for this application"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Parent Menu Info */}
          {selectedParent && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MenuIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Parent Menu: {selectedParent.name}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                @{selectedParent.code}
              </p>
            </div>
          )}

          {/* Menu Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              Menu Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter menu name (e.g., User Management)"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Menu Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Menu Code *
            </Label>
            <Input
              id="code"
              placeholder="Enter menu code (e.g., user_management)"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code}</p>
            )}
            <p className="text-xs text-gray-500">
              Unique identifier using lowercase letters, numbers, and
              underscores only
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the menu's purpose (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Menu Icon */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                Icon
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => handleInputChange("icon", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <span>{icon.icon}</span>
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Sort Order
              </Label>
              <Input
                id="sort_order"
                type="number"
                placeholder="Auto"
                value={formData.sort_order}
                onChange={(e) =>
                  handleInputChange("sort_order", e.target.value)
                }
                className={errors.sort_order ? "border-red-500" : ""}
              />
              {errors.sort_order && (
                <p className="text-sm text-red-600">{errors.sort_order}</p>
              )}
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              URL
            </Label>
            <Input
              id="url"
              placeholder="Menu URL (optional, e.g., /users)"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
          </div>

          {/* Parent Menu Selection (if not preset) */}
          {!parentId && parentOptions.length > 0 && (
            <div className="space-y-2">
              <Label>Parent Menu</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => handleInputChange("parent_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent menu (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root Menu)</SelectItem>
                  {parentOptions.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id.toString()}>
                      {menu.name} (@{menu.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <Label htmlFor="is_active" className="text-sm">
              Active (menu will be visible to users)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Menu
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuModal;
