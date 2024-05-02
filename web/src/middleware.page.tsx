import { NextResponse, type NextRequest } from "next/server";

export const middleware = (req: NextRequest): NextResponse => {
	const url = req.nextUrl;

	// As we are standardising all the routes to lowercase, we need to exclude these next.js files to avoid 404 errors in production
	if (
		url.pathname.includes("_ssgManifest.js") ||
		url.pathname.includes("_buildManifest.js")
	) {
		return NextResponse.next();
	}

	if (url.pathname === url.pathname.toLowerCase()) {
		return NextResponse.next();
	}

	return NextResponse.redirect(
		new URL(url.origin + url.pathname.toLowerCase())
	);
};
