import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
	const url = req.nextUrl;
	if (url.pathname === url.pathname.toLowerCase()) {
		return NextResponse.next();
	}

	return NextResponse.redirect(
		new URL(url.origin + url.pathname.toLowerCase())
	);
};

export default middleware;
