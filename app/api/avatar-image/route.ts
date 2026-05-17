import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const blockedHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src") ?? "";

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  if (!["https:", "http:"].includes(url.protocol) || blockedHosts.has(url.hostname.toLowerCase())) {
    return new NextResponse("Image URL is not allowed", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      },
      next: { revalidate: 3600 }
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return new NextResponse("Avatar image could not be loaded", { status: 404 });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=3600, s-maxage=3600"
      }
    });
  } catch {
    return new NextResponse("Avatar image could not be loaded", { status: 404 });
  }
}
