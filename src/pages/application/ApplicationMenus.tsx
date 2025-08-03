import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Plus,
  Search,
  Menu as MenuIcon,
  Globe,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTitle } from "@/hooks/useTitle";
import { toast } from "sonner";
import { applicationService } from "@/services/applicationService";
import { menuService } from "@/services/menuService";
import CreateMenuModal from "./_components/CreateMenuModal";
import { getParentMenu, isMenuEditable } from "./helper";
import MenuDeleteModal from "./_components/MenuDeleteModal";
import MenuEditModal from "./_components/MenuEditModal";

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

interface Application {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

const ApplicationMenusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const applicationId = parseInt(id || "0");

  useTitle("Manage Menus - User Service");

  const [application, setApplication] = useState<Application | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState<Menu | null>(null);

  // Load application and menus
  useEffect(() => {
    loadData();
  }, [applicationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load application details
      const appResponse = await applicationService.getApplicationById(
        applicationId
      );
      if (appResponse.success && appResponse.data) {
        setApplication(appResponse.data);
      } else {
        toast.error("Application not found");
        navigate("/applications");
        return;
      }

      // Load menus
      await loadMenus();
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadMenus = async () => {
    try {
      const response = await menuService.getMenusByApplication(applicationId);
      if (response.success && response.data) {
        setMenus(response.data);

        // Auto expand semua menu yang memiliki children
        const menuTree = buildMenuTree(response.data);
        const menusWithChildren = new Set<number>();

        const findMenusWithChildren = (menus: Menu[]) => {
          menus.forEach((menu) => {
            if (menu.children && menu.children.length > 0) {
              menusWithChildren.add(menu.id);
              findMenusWithChildren(menu.children);
            }
          });
        };

        findMenusWithChildren(menuTree);
        setExpandedMenus(menusWithChildren);
      }
    } catch (error: any) {
      console.error("Error loading menus:", error);
      toast.error("Failed to load menus");
    }
  };
  const handleToggleStatus = async (menuId: number) => {
    try {
      const response = await menuService.toggleMenuStatus(menuId);
      if (response.success) {
        await loadMenus();
        toast.success("Menu status updated successfully");
      } else {
        toast.error(response.message || "Failed to update menu status");
      }
    } catch (error: any) {
      console.error("Error toggling menu status:", error);
      toast.error("Failed to update menu status");
    }
  };

  const handleCreateMenu = (parentId?: number) => {
    setSelectedParentId(parentId || null);
    setIsCreateModalOpen(true);
  };

  const handleMenuCreated = async () => {
    setIsCreateModalOpen(false);
    setSelectedParentId(null);
    await loadMenus();
    toast.success("Menu created successfully");
  };

  const handleDeleteMenu = (menu: Menu) => {
    setMenuToDelete(menu);
    setIsDeleteModalOpen(true);
  };

  const toggleExpanded = (menuId: number) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const buildMenuTree = (menus: Menu[]): Menu[] => {
    const menuMap = new Map<number, Menu>();
    const rootMenus: Menu[] = [];

    // Create a map of all menus
    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // Build the tree structure
    menus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id)!;

      // Convert parent_id to number if it's a string
      const parentId =
        typeof menu.parent_id === "string"
          ? parseInt(menu.parent_id, 10)
          : menu.parent_id;

      if (parentId && menuMap.has(parentId)) {
        const parent = menuMap.get(parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(menuItem);
      } else {
        rootMenus.push(menuItem);
      }
    });

    console.groupEnd();

    return rootMenus;
  };

  const confirmDeleteMenu = async (menuId: number) => {
    try {
      const response = await menuService.deleteMenu(menuId);
      if (response.success) {
        await loadMenus();
        toast.success("Menu deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete menu");
      }
    } catch (error: any) {
      console.error("Error deleting menu:", error);
      throw error;
    }
  };

  const handleEditMenu = (menu: Menu) => {
    setMenuToEdit(menu);
    setIsEditModalOpen(true);
  };

  const updateMenu = async (menuId: number, data: any) => {
    try {
      const response = await menuService.updateMenu(menuId, data);
      if (response.success) {
        await loadMenus();
        return;
      }
      throw new Error(response.message || "Failed to update menu");
    } catch (error: any) {
      console.error("Error updating menu:", error);
      throw error;
    }
  };

  const filterMenus = (menus: Menu[]): Menu[] => {
    const filtered = menus.filter((menu) => {
      const matchesSearch =
        !searchQuery ||
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.code.toLowerCase().includes(searchQuery.toLowerCase());

      // Selalu return true untuk status (tampilkan semua menu)
      const matchesStatus = true; // Hapus filter status, tampilkan semua

      return matchesSearch && matchesStatus;
    });

    return filtered;
  };

  const renderMenu = (menu: Menu, level: number = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedMenus.has(menu.id);
    const isEditable = isMenuEditable(menu, menus);
    const parent = getParentMenu(menu.id, menus);

    return (
      <div key={menu.id} className="border-b border-gray-100 last:border-b-0">
        <div
          className={`flex items-center gap-3 p-3 hover:bg-gray-50 ${
            level > 0 ? "border-l-2 border-blue-200 bg-blue-50/30" : ""
          } ${!isEditable ? "opacity-60" : ""}`}
          style={{
            marginLeft: level * 32,
            paddingLeft: level > 0 ? "1rem" : "0.75rem",
          }}
        >
          {/* Drag Handle - disabled jika parent tidak aktif */}
          <GripVertical
            className={`h-4 w-4 text-gray-400 ${
              isEditable ? "cursor-move" : "cursor-not-allowed opacity-50"
            }`}
          />

          <div className="w-6 flex justify-center">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(menu.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : null}
          </div>

          <div
            className={`w-8 h-8 rounded flex items-center justify-center ${
              level > 0 ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <MenuIcon
              className={`h-4 w-4 ${
                level > 0 ? "text-blue-600" : "text-gray-600"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={`text-sm font-medium truncate ${
                  level > 0 ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {level > 0 && "↳ "}
                {menu.name}
              </h4>
              <span
                className={`text-xs ${
                  level > 0 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                @{menu.code}
              </span>
              {!menu.is_active && <EyeOff className="h-3 w-3 text-red-500" />}
              {!isEditable && parent && !parent.is_active && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                  Parent Inactive
                </span>
              )}
            </div>
            {menu.description && (
              <p
                className={`text-xs truncate ${
                  level > 0 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {menu.description}
              </p>
            )}
            {menu.url && (
              <p className="text-xs text-blue-600 truncate">{menu.url}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="text-xs text-gray-400 min-w-[3rem] text-center">
            #{menu.sort_order}
          </div>

          {/* Status */}
          <div className="min-w-[4rem]">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                menu.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {menu.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Actions - dengan kondisi disabled */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={!isEditable} // Disable jika parent tidak aktif
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Menu Actions
                {!isEditable && (
                  <span className="block text-xs text-orange-600 font-normal">
                    (Parent menu is inactive)
                  </span>
                )}
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => handleEditMenu(menu)}
                disabled={!isEditable}
                className={!isEditable ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Menu
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleCreateMenu(menu.id)}
                disabled={!isEditable}
                className={!isEditable ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Sub-menu
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Toggle status - hanya disable edit, bukan status toggle */}
              <DropdownMenuItem
                onClick={() => handleToggleStatus(menu.id)}
                className={
                  menu.is_active ? "text-yellow-600" : "text-green-600"
                }
                disabled={!isEditable}
              >
                {menu.is_active ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleDeleteMenu(menu)}
                className="text-red-600"
                disabled={!isEditable}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Menu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render children if expanded */}
        {hasChildren &&
          isExpanded &&
          menu.children?.map((child) => renderMenu(child, level + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 font-medium">Loading menus...</span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Application not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const menuTree = buildMenuTree(filterMenus(menus));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/applications"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MenuIcon className="h-6 w-6 text-blue-600" />
              Manage Menus
            </h1>
            <p className="text-sm text-gray-600">
              Application: {application.name} (@{application.code})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/applications/${applicationId}`)}
          >
            View Application
          </Button>
          <Button onClick={() => handleCreateMenu()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu
          </Button>
        </div>
      </div>

      {/* Application Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">{application.name}</h3>
            <p className="text-sm text-blue-700">@{application.code}</p>
            {application.description && (
              <p className="text-sm text-blue-600 mt-1">
                {application.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search menus..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <Button
          variant={showInactive ? "default" : "outline"}
          size="sm"
          onClick={() => setShowInactive(!showInactive)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showInactive ? "Show All" : "Show Inactive"}
        </Button>
      </div>

      {/* Menu List */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Menu Structure ({menuTree.length} root menus)
            </h3>
            <div className="text-sm text-gray-500">
              Drag to reorder • Click arrow to expand
            </div>
          </div>
        </div>

        <div className="divide-y">
          {menuTree.length === 0 ? (
            <div className="p-8 text-center">
              <MenuIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No menus found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Start by creating your first menu for this application.
              </p>
              <Button onClick={() => handleCreateMenu()}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Menu
              </Button>
            </div>
          ) : (
            menuTree.map((menu) => renderMenu(menu))
          )}
        </div>
      </div>

      <CreateMenuModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedParentId(null);
        }}
        onSuccess={handleMenuCreated}
        applicationId={applicationId}
        parentId={selectedParentId}
        menus={menus}
      />

      <MenuDeleteModal
        menu={menuToDelete}
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMenuToDelete(null);
        }}
        onDeleteMenu={confirmDeleteMenu}
      />
      <MenuEditModal
        menu={menuToEdit}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setMenuToEdit(null);
        }}
        onUpdateMenu={updateMenu}
        parentMenus={menus.filter((m) => !m.parent_id)} // Hanya root menus sebagai parent options
        applicationId={applicationId}
      />
    </div>
  );
};

export default ApplicationMenusPage;
