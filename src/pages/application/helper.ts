import type { Menu } from "@/types/application";

export const getParentMenu = (
  menuId: number,
  allMenus: Menu[]
): Menu | null => {
  const currentMenu = allMenus.find((m) => m.id === menuId);
  if (!currentMenu?.parent_id) return null;

  const parentId =
    typeof currentMenu.parent_id === "string"
      ? parseInt(currentMenu.parent_id, 10)
      : currentMenu.parent_id;

  return allMenus.find((m) => m.id === parentId) || null;
};

// Function untuk mengecek apakah menu bisa diedit (parent aktif)
export const isMenuEditable = (menu: Menu, allMenus: Menu[]): boolean => {
  // Jika menu adalah root (tidak ada parent), selalu bisa diedit
  if (!menu.parent_id) return true;

  // Cari parent menu
  const parent = getParentMenu(menu.id, allMenus);

  // Jika parent tidak ditemukan, anggap bisa diedit
  if (!parent) return true;

  // Jika parent tidak aktif, tidak bisa diedit
  if (!parent.is_active) return false;

  // Recursive check untuk parent yang lebih tinggi
  return isMenuEditable(parent, allMenus);
};
