import { NextRequest } from "next/server";

const BACKEND_API_BASE = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

export const dynamic = "force-dynamic";

function isLocalhostUrl(value: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);
}

async function proxy(request: NextRequest, pathname: string) {
  if (!BACKEND_API_BASE) {
    return Response.json(
      { detail: "BACKEND_API_BASE_URL is not configured for this deployment." },
      { status: 500 },
    );
  }

  if (process.env.NODE_ENV === "production" && isLocalhostUrl(BACKEND_API_BASE)) {
    return Response.json(
      { detail: "BACKEND_API_BASE_URL points to localhost in production. Update your Vercel env vars to the live backend URL." },
      { status: 500 },
    );
  }

  const upstreamUrl = new URL(`${BACKEND_API_BASE.replace(/\/$/, "")}${pathname}`);
  if (request.nextUrl.search) {
    upstreamUrl.search = request.nextUrl.search;
  }

  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: "no-store",
    redirect: "manual",
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/v1/${path.join("/")}`);
}