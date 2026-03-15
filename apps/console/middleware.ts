import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth middleware for console.
 * - With Cloudflare Access: valid requests include Cf-Access-Jwt-Assertion.
 * - In development (no Access): allow all. Set SKIP_AUTH=1 or run locally without Access.
 * - In production with Access: redirect unauthenticated to Access login (handled by Access itself when the route is protected).
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

  // No JWT: could redirect to Access login or return 401. Access typically intercepts before Worker.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
