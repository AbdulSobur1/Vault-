import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

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

  const is2FARoute =
    nextUrl.pathname.startsWith("/setup-2fa") ||
    nextUrl.pathname.startsWith("/verify-2fa");

  // Not logged in — redirect to login
  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in user visiting auth routes — redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2FA checks for dashboard routes — must have valid 2FA session cookie
  if (isLoggedIn && isDashboardRoute) {
    const twoFAToken = req.cookies.get("vaulte_2fa")?.value;

    if (!twoFAToken) {
      return NextResponse.redirect(new URL("/verify-2fa", req.url));
    }
  }

  // Allow 2FA routes to load
  if (isLoggedIn && is2FARoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|terms|privacy|cookie-policy|ndic-notice|about|blog|careers|press).*)",
  ],
};
