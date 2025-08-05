import { NextResponse, type NextRequest } from "next/server";

export const middleware = (req: NextRequest): NextResponse => {
	const url = req.nextUrl;
	if (url.pathname === url.pathname.toLowerCase()) {
		return NextResponse.next();
	}

	return NextResponse.redirect(
		new URL(url.origin + url.pathname.toLowerCase())
	);
};
