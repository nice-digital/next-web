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
	const redirectURL = new URL(
		url.origin + pathname.toLowerCase() + url.search + url.hash
	);

	// Only replace localhost:3000 with production domain for mixed-case redirects
	if (redirectURL.hostname === "localhost") {
		redirectURL.hostname = "www.nice.org.uk";
		redirectURL.protocol = "https";
		redirectURL.port = "";
	}

	return NextResponse.redirect(redirectURL, 308);
}

// Optional: broad matcher; middleware code will itself skip assets
export const config = {
	matcher: "/:path*",
};
