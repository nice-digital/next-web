import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const SKIP_REGEXES: RegExp[] = [
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

const shouldSkip = (p: string): boolean =>
	SKIP_REGEXES.some((re) => re.test(p));

export function middleware(req: NextRequest): NextResponse {
	const { pathname, search } = req.nextUrl;

	if (shouldSkip(pathname)) return NextResponse.next();

	const lower = pathname.toLowerCase();
	if (pathname === lower) return NextResponse.next();

	const dest = new URL(req.url);
	dest.pathname = lower;
	dest.search = search;

	return NextResponse.redirect(dest.href, 308);
}

export const config = { matcher: "/:path*" };
