import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve tokens from cookies. 
  // Note: Once your backend is connected, your login function should set these cookies.
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("userRole")?.value; 

  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 1. Redirect authenticated users away from login/register pages
  if (isAuthRoute && token && role) {
    return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
  }

  // 2. Protect dashboard routes from unauthenticated users
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    // Optional: Save the attempted URL to redirect them back after they log in
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Enforce strict Role-Based Access Control (RBAC)
  if (isDashboardRoute && token && role) {
    if (pathname.startsWith("/dashboard/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
    if (pathname.startsWith("/dashboard/technician") && role !== "TECHNICIAN") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
  }

  // Allow the request to proceed if all checks pass
  return NextResponse.next();
}

// Specify exactly which routes this middleware should run on to optimize performance
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*"
  ],
};