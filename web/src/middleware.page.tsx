import { NextResponse, type NextRequest } from "next/server";
import { logger } from "@/logger";
const SKIP_REGEXES: RegExp[] = [
	/^\/_next\//,
	/^\/static\//,
	/^\/api\//,
	/^\/favicon.ico$/,
	/^\/sw.js$/,
	/^\/manifest.json$/,
	/^\/build-manifest.json$/,
	/^\/react-loadable-manifest.json$/,
	/^\/.*\.[^/]+$/, // any path containing a dot (file with extension)
];

function shouldSkip(pathname: string): boolean {
	return SKIP_REGEXES.some((re) => re.test(pathname));
}

export function middleware(req: NextRequest): NextResponse {
	const url = req.nextUrl.clone();
	const pathname = url.pathname;
	logger.warn(`Request: ${JSON.stringify(req)}`);
	logger.warn(`Request URL: ${url}`);
	logger.warn(`Request pathname: ${pathname}`);
	// Skip static/asset/manifest/api/internal requests
	if (shouldSkip(pathname)) {
		return NextResponse.next();
	}

	// If the path is already lowercase, do nothing
	if (pathname === pathname.toLowerCase()) {
		logger.warn(`Request pathname is already lowercase: ${pathname}`);
		return NextResponse.next();
	}

	// Otherwise redirect to the lowercased path and preserve search/hash
	// url.pathname = pathname.toLowerCase();
	// return NextResponse.redirect(url, 308);
	const redirectURL = new URL(url.origin + url.pathname.toLowerCase());
	logger.warn(`Redirecting to lowercase pathname: ${redirectURL}`);
	return NextResponse.redirect(redirectURL);
}

// Optional: broad matcher; middleware code will itself skip assets
export const config = {
	matcher: "/:path*",
};
