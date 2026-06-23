import { NextRequest } from "next/server";

const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.BACKEND_API_BASE_URL ?? "http://127.0.0.1:8011/api/v1";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ source: string[] }> }) {
  const { source } = await context.params;
  const encoded = source.join("/");

  if (!encoded) {
    return Response.json({ detail: "Missing url" }, { status: 400 });
  }

  let sourceUrl: string;
  try {
    sourceUrl = decodeURIComponent(encoded);
  } catch {
    return Response.json({ detail: "Invalid url" }, { status: 400 });
  }

  const upstreamUrl = new URL(`${BACKEND_API_BASE.replace(/\/$/, "")}/media/proxy`);
  upstreamUrl.searchParams.set("url", sourceUrl);

  const upstream = await fetch(upstreamUrl, {
    cache: "no-store",
    headers: {
      Accept: request.headers.get("accept") ?? "image/*",
    },
  });

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const cacheControl = upstream.headers.get("cache-control");
  const imageCache = upstream.headers.get("x-image-cache");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  if (cacheControl) {
    headers.set("Cache-Control", cacheControl);
  }
  if (imageCache) {
    headers.set("X-Image-Cache", imageCache);
  }
  headers.set("X-Proxy-Source", "frontend");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}