"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, User, LogOut, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth state on mount and route change
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Fix<span className="text-blue-600">It</span>Now
          </span>
        </Link>

        {/* Desktop Navigation - Authentication Based */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/services" 
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/services" ? "text-blue-600" : "text-slate-600"}`}
          >
            Services
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard/customer" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname?.includes("/dashboard/customer") ? "text-blue-600" : "text-slate-600"}`}
              >
                Customer Dashboard
              </Link>
              <Link 
                href="/dashboard/technician" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname?.includes("/dashboard/technician") ? "text-blue-600" : "text-slate-600"}`}
              >
                Technician Portal
              </Link>
            </>
          ) : (
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/about" ? "text-blue-600" : "text-slate-600"}`}
            >
              About Us
            </Link>
          )}
        </nav>

        {/* Right Actions / Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/customer")}>
                <User className="w-4 h-4 mr-1 text-slate-500" /> Account
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white px-4 pt-2 pb-4 space-y-3">
          <Link 
            href="/services" 
            className="block text-sm font-medium text-slate-700 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                href="/dashboard/customer" 
                className="block text-sm font-medium text-slate-700 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customer Dashboard
              </Link>
              <Link 
                href="/dashboard/technician" 
                className="block text-sm font-medium text-slate-700 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Technician Portal
              </Link>
              <div className="pt-2 border-t flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 w-full">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
            </>
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