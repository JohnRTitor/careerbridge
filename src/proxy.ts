import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/onboarding")
  ) {
    return NextResponse.next();
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || request.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const sessionData = await response.json();
  const session = sessionData?.session;
  const user = sessionData?.user;

  if (!session || !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.role || "user";

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Notice: /dashboard handles its own role-based rendering inside its page component,
  // so we don't need to block /dashboard based on specific roles, only that they are logged in.

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/onboarding/:path*"],
};
