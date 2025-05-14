"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrAuth =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminOrAuth && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminOrAuth && <Footer />}
    </div>
  );
}
