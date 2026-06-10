import { NextResponse, type NextRequest } from "next/server";

const allowedExactPaths = new Set([
  "/",
  "/projects",
  "/projects/",
  "/rohit/admin",
  "/rohit/admin/",
  "/rohit/admin/config",
  "/rohit/admin/achievements",
  "/rohit/admin/education",
  "/rohit/admin/experience",
  "/rohit/admin/messages",
  "/rohit/admin/profile",
  "/rohit/admin/projects",
  "/rohit/admin/skills",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.svg"
]);

const allowedPathPrefixes = [
  "/api/",
  "/_next/"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAllowedPath =
    allowedExactPaths.has(pathname) ||
    allowedPathPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    /^\/projects\/[^/]+$/.test(pathname) ||
    pathname.includes(".");

  if (isAllowedPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";

  return NextResponse.redirect(url);
}
