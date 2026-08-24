"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, User, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN" | null;

const technicianSubNav = [
  { href: "/dashboard/technician", label: "Jobs" },
  { href: "/dashboard/technician/profile", label: "Profile" },
  { href: "/dashboard/technician/services", label: "My Service" },
  { href: "/dashboard/technician/availability", label: "Availability" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userRole = Cookies.get("userRole") as Role;
    setRole(token && userRole ? userRole : null);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("userRole");
    setRole(null);
    router.push("/auth/login");
  };

  const dashboardPath = role ? `/dashboard/${role.toLowerCase()}` : "/auth/login";
  const dashboardLabel =
    role === "CUSTOMER" ? "My Dashboard" :
    role === "TECHNICIAN" ? "Technician Portal" :
    role === "ADMIN" ? "Admin Panel" : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Fix<span className="text-blue-600">It</span>Now
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/services" ? "text-blue-600" : "text-slate-600"}`}
          >
            All Services
          </Link>

          {role && role !== "TECHNICIAN" && (
            <Link
              href={dashboardPath}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname?.startsWith(dashboardPath) ? "text-blue-600" : "text-slate-600"}`}
            >
              {dashboardLabel}
            </Link>
          )}

          {role === "TECHNICIAN" &&
            technicianSubNav.map((item) => {
              const isActive =
                item.href === "/dashboard/technician"
                  ? pathname === "/dashboard/technician"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? "text-blue-600" : "text-slate-600"}`}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {role ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push(dashboardPath)}>
                <User className="w-4 h-4 mr-1 text-slate-500" /> {role.charAt(0) + role.slice(1).toLowerCase()}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                <LogIn className="w-4 h-4 mr-1" /> Login
              </Button>
              <Button size="sm" onClick={() => router.push("/auth/register")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            href="/services"
            className="block text-sm font-medium text-slate-700 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>

          {role && role !== "TECHNICIAN" && (
            <Link
              href={dashboardPath}
              className="block text-sm font-medium text-slate-700 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dashboardLabel}
            </Link>
          )}

          {role === "TECHNICIAN" &&
            technicianSubNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-slate-700 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

          {role ? (
            <div className="pt-2 border-t flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 w-full">
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <div className="pt-2 border-t flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { router.push("/auth/login"); setMobileMenuOpen(false); }} className="w-full">
                Login
              </Button>
              <Button size="sm" onClick={() => { router.push("/auth/register"); setMobileMenuOpen(false); }} className="w-full bg-blue-600 text-white">
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}