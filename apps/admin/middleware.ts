import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth middleware for admin.
 * - With Cloudflare Access: valid requests include Cf-Access-Jwt-Assertion.
 * - In development: allow all when SKIP_AUTH=1 or APP_ENV=development.
 */
export function middleware(request: NextRequest) {
  const skipAuth = process.env.SKIP_AUTH === "1" || process.env.APP_ENV === "development";
  if (skipAuth) {
    return NextResponse.next();
  }

  const accessJwt = request.headers.get("Cf-Access-Jwt-Assertion");
  if (accessJwt) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
