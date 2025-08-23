import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { ROUTES } from "@/lib/route";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const session = await auth();

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = ROUTES.AUTH.includes(nextUrl.pathname);
  const isPrivateRoute = !isApiRoute && !isAuthRoute;

  if (isApiRoute) return NextResponse.next();

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL("/auth", nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
