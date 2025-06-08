"use client";

import { useState } from "react";
import SuperAdminSidebar from "../../components/super-admin/sidebar";
import { cn } from "../../lib/utils";
function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar
        isOpen={isSideBarOpen}
        toggle={() => setIsSideBarOpen(!isSideBarOpen)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          isSideBarOpen ? "ml-64" : "ml-16",
          "min-h-screen"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default SuperAdminLayout;
