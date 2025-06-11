"use client";

import Header from "../user/header";
import { usePathname } from "next/navigation";

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathsNotShowHeader = ["/auth", "/super-admin"];

  const pathName = usePathname();

  const showHeader = !pathsNotShowHeader.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  console.log("showHeader", showHeader, pathName);
  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}

export default CommonLayout;
