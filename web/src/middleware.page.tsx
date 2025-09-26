// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const SKIP_REGEXES: RegExp[] = [
	/^\/_next\//, // Next internals (chunks, assets)
	/^\/static\//, // static folder if used
	/^\/api\//, // API routes
	/^\/favicon\.ico$/, // favicon
	/^\/sw\.js$/, // service worker
	/^\/manifest\.json$/, // manifest
	/^\/build-manifest\.json$/, // next build manifest
	/^\/react-loadable-manifest\.json$/, // react loadable manifest
	/^\/.*\.[^/]+$/, // any path containing a dot (file with extension)
];

function shouldSkip(pathname: string): boolean {
	return SKIP_REGEXES.some((re) => re.test(pathname));
}

export function middleware(req: NextRequest): NextResponse | void {
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
	url.pathname = pathname.toLowerCase();
	return NextResponse.redirect(url, 308);
}

// Optional: broad matcher; middleware code will itself skip assets
export const config = {
	matcher: "/:path*",
};
