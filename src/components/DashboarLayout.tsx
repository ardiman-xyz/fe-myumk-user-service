import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboarLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster richColors position="top-center" />
      <main className="flex-1 w-full">
        <div className="border-b print:border-none print:px-0 print:py-0 px-4 py-2">
          <div className="print:hidden">
            <SidebarTrigger />
          </div>
        </div>
        <div className="p-6">{children || <Outlet />}</div>
      </main>
    </SidebarProvider>
  );
}
