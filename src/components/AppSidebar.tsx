import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Shield,
  Building,
  Key,
  Menu as MenuIcon,
  Activity,
  Settings,
  UserCheck,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { JSX } from "react";
import { useAuth } from "@/context/AuthProvider";
import { NavUser } from "./NavUser";

// Type definitions
interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    label: "User Management",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "User Roles",
        url: "/user-roles",
        icon: UserCheck,
      },
      {
        title: "Role Assignment",
        url: "/role-assignment",
        icon: UserCog,
      },
    ],
  },
  {
    label: "Access Control",
    items: [
      {
        title: "Roles",
        url: "/roles",
        icon: Shield,
      },
      {
        title: "Permissions",
        url: "/permissions",
        icon: Key,
      },
      {
        title: "Menu Management",
        url: "/menus",
        icon: MenuIcon,
      },
    ],
  },
  {
    label: "System Management",
    items: [
      {
        title: "Applications",
        url: "/applications",
        icon: Building,
      },
      {
        title: "Activity Logs",
        url: "/activity-logs",
        icon: Activity,
      },
      {
        title: "System Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

interface MenuSectionProps {
  items: MenuItem[];
  location: { pathname: string };
}

const MenuSection: React.FC<MenuSectionProps> = ({ items, location }) => (
  <SidebarMenu>
    {items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={location.pathname.includes(item.url)}
        >
          <Link to={item.url}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
);

export function AppSidebar(): JSX.Element | null {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null; 
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">US</span>
          </div>
          <span className="text-lg font-semibold">User Service</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.includes("/dashboard")}
                >
                  <Link to={"/dashboard"}>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {menuSections.map((section: MenuSection) => (
          <SidebarGroup key={section.label} className="-mt-2">
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <MenuSection items={section.items} location={location} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}