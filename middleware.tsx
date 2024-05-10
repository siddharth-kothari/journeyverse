import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("next-auth.session-token")?.value || "";

  const isPublicPath = path === "/login" || path === "/register";

  console.log("isPublicPath"), isPublicPath;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/create-post", "/login", "/register"],
};
