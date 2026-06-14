import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;

  const isDashboardRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/accounts") ||
    nextUrl.pathname.startsWith("/wallets") ||
    nextUrl.pathname.startsWith("/crypto") ||
    nextUrl.pathname.startsWith("/transfer") ||
    nextUrl.pathname.startsWith("/fund") ||
    nextUrl.pathname.startsWith("/cards") ||
    nextUrl.pathname.startsWith("/loans") ||
    nextUrl.pathname.startsWith("/bills") ||
    nextUrl.pathname.startsWith("/settings") ||
    nextUrl.pathname.startsWith("/transactions");

  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  // Not logged in — redirect to login
  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in visiting auth routes — redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|terms|privacy|cookie-policy|ndic-notice|about|blog|careers|press|setup-2fa|verify-2fa).*)",
  ],
};
