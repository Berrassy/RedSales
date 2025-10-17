import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protected routes that require authentication
    const protectedRoutes = ["/wishlist", "/panier"];
    const adminRoutes = ["/admin"]; // Future admin routes

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some(route => 
      pathname.startsWith(route)
    );

    // If accessing protected route without authentication, redirect to sign in
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // If accessing admin route without admin role, redirect to home
    if (isAdminRoute && token && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const protectedRoutes = ["/wishlist", "/panier"];
        const adminRoutes = ["/admin"];

        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );
        const isAdminRoute = adminRoutes.some(route => 
          pathname.startsWith(route)
        );

        // Allow access to non-protected routes
        if (!isProtectedRoute && !isAdminRoute) {
          return true;
        }

        // For protected routes, require authentication
        if (isProtectedRoute) {
          return !!token;
        }

        // For admin routes, require admin role
        if (isAdminRoute) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/wishlist/:path*",
    "/panier/:path*",
    "/admin/:path*",
  ],
};
