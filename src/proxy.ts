import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/candidate") &&
    !pathname.startsWith("/recruiter") &&
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

  if (pathname.startsWith("/recruiter") && role !== "recruiter" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/candidate") && role !== "candidate" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/recruiter/:path*", "/candidate/:path*", "/onboarding/:path*"],
};
