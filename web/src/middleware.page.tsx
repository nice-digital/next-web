import { NextResponse, type NextRequest } from "next/server";

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

	// Skip static/asset/manifest/api/internal requests
	if (shouldSkip(pathname)) {
		return NextResponse.next();
	}

	// If the path is already lowercase, do nothing
	if (pathname === pathname.toLowerCase()) {
		return NextResponse.next();
	}

	// Otherwise redirect to the lowercased path and preserve search/hash
	// url.pathname = pathname.toLowerCase();
	// return NextResponse.redirect(url, 308);
	return NextResponse.redirect(
		new URL(url.origin + url.pathname.toLowerCase())
	);
}

// Optional: broad matcher; middleware code will itself skip assets
export const config = {
	matcher: "/:path*",
};