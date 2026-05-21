import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Stitch HTML previews — not part of the production app. */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const path = request.nextUrl.pathname;
    if (path === "/dev" || path.startsWith("/dev/") || path === "/design-system") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dev", "/dev/:path*", "/design-system"],
};
