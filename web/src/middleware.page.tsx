import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SKIP_REGEXES = [
  /^\/_next\//,
  /^\/static\//,
  /^\/api\//,
  /^\/favicon.ico$/,
  /^\/sw.js$/,
  /^\/manifest\.json$/,
  /^\/build-manifest\.json$/,
  /^\/react-loadable-manifest\.json$/,
  /^\/.*\.[^/]+$/,
];

const shouldSkip = (p: string) => SKIP_REGEXES.some(re => re.test(p));

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkip(pathname)) return NextResponse.next();

  const lower = pathname.toLowerCase();
  if (pathname === lower) return NextResponse.next();

  // Build an absolute URL from the actual request URL
  const dest = new URL(req.url);
  dest.pathname = lower; // search is already on req.url; keep it

  // (Optional) honor proxy headers if you’re behind a CDN/LB
  const xfProto = req.headers.get("x-forwarded-proto");
  const xfHost  = req.headers.get("x-forwarded-host");
  if (xfProto) dest.protocol = xfProto + ":";
  if (xfHost)  dest.host = xfHost;
console.log("redirecting", { from: req.url, to: dest.href });

  // (Optional) avoid HTTPS on localhost to prevent SSL protocol errors
  if (dest.hostname === "localhost" || dest.hostname === "127.0.0.1") {
    dest.protocol = "http:";
  }

  return NextResponse.redirect(dest.href, 308);
}

export const config = { matcher: "/:path*" };
