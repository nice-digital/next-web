import { NextResponse, type NextRequest } from "next/server";

export const logger = {
	info: (...args: unknown[]) => console.info("[Edge]", ...args),
	warn: (...args: unknown[]) => console.warn("[Edge]", ...args),
	error: (...args: unknown[]) => console.error("[Edge]", ...args),
};

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

	logger.warn(`Request ###########: ${JSON.stringify(req)} ###########`);
	logger.warn(`Request URL ###########: ${url} ###########`);
	logger.warn(`Request pathname ###########: ${pathname} ###########`);

	// Skip static/asset/manifest/api/internal requests
	if (shouldSkip(pathname)) {
		return NextResponse.next();
	}

	// If the path is already lowercase, do nothing
	if (pathname === pathname.toLowerCase()) {
		logger.warn(`url ########### ${url} ###########`);
		logger.warn(
			`Request pathname is already lowercase ###########: ${pathname} ###########`
		);
		return NextResponse.next();
	}

	// Otherwise redirect to the lowercased path and preserve search/hash
	const redirectURL = new URL(
		url.origin + pathname.toLowerCase() + url.search + url.hash
	);

	// const isProduction = process.env.NODE_ENV === "production";

	// Only replace localhost:3000 with production domain for mixed-case redirects
	if (redirectURL.hostname === "localhost") {
		redirectURL.hostname = "www.nice.org.uk";
		redirectURL.protocol = "https";
		redirectURL.port = "";
	}

	logger.warn(
		`Redirecting to lowercase pathname ###########: ${redirectURL} ###########`
	);
	return NextResponse.redirect(redirectURL, 308);
}

// Optional: broad matcher; middleware code will itself skip assets
export const config = {
	matcher: "/:path*",
};
