import { NextResponse } from "next/server";

export function middleware(req) {
  const adminAuth = req.cookies.get("adminAuth")?.value;
  const url = req.nextUrl;

  // Protect admin pages (except signin/signup)
  if (
    url.pathname.startsWith("/admin") &&
    url.pathname !== "/signin" &&
    url.pathname !== "/signup"
  ) {
    if (!adminAuth) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Redirect logged-in admin away from signin/signup
  if ((url.pathname === "/signin" || url.pathname === "/signup") && adminAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
