import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "../routes";

export async function middleware(req: NextRequest) {
  // console.log("Middleware called");

  const session = await getToken({ req });

  // console.log("Session:", session);

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!session;

  // console.log("Pathname:", pathname);
  // console.log("IsLoggedIn:", isLoggedIn);

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // console.log("isApiAuthRoute:", isApiAuthRoute);
  // console.log("isPublicRoute:", isPublicRoute);
  // console.log("isAuthRoute:", isAuthRoute);

  if (isApiAuthRoute) {
    // console.log("Handling API Auth Route");
    return NextResponse.next();
  }

  if (isAuthRoute) {
    // console.log("Handling Auth Route");
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    // console.log("Handling Unauthorized Access");
    return Response.redirect(new URL("/login", req.url));
  }

  // console.log("Allowing Access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
