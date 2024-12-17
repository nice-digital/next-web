import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
	console.log("GET /api/env2");
	const envVars = {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_AUTH_ENVIRONMENT: process.env.NEXT_PUBLIC_AUTH_ENVIRONMENT,
		NEXT_PUBLIC_BUILD_NUMBER: process.env.NEXT_PUBLIC_BUILD_NUMBER,
		NEXT_PUBLIC_SEARCH_BASE_URL: process.env.NEXT_PUBLIC_SEARCH_BASE_URL,
	};

	return NextResponse.json(envVars);
}
