import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
	const envVars = {
		PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,
		PUBLIC_AUTH_ENVIRONMENT: process.env.PUBLIC_AUTH_ENVIRONMENT,
		SANTA_BUILD_NUMBER: process.env.SANTA_BUILD_NUMBER,
		PUBLIC_BUILD_NUMBER: process.env.PUBLIC_BUILD_NUMBER,
		PUBLIC_SEARCH_BASE_URL: process.env.PUBLIC_SEARCH_BASE_URL,
		PUBLIC_DENY_ROBOTS: process.env.PUBLIC_DENY_ROBOTS,
		NEXT_PUBLIC_JOHN: process.env.NEXT_PUBLIC_JOHN,
		PUBLIC_JOHN: process.env.PUBLIC_JOHN,
		PUBLIC_NEW_JOHN: process.env.PUBLIC_NEW_JOHN,
		SANTA_BOTH: process.env.SANTA_BOTH,
		SANTA_TC: process.env.SANTA_TC,
		SANTA_ENV: process.env.SANTA_ENV,
		SANTA_NONE: process.env.SANTA_NONE,
		NEXT_PUBLIC_SANTA_BOTH: process.env.NEXT_PUBLIC_SANTA_BOTH,
		NEXT_PUBLIC_SANTA_TC: process.env.NEXT_PUBLIC_SANTA_TC,
		NEXT_PUBLIC_SANTA_ENV: process.env.NEXT_PUBLIC_SANTA_ENV,
		NEXT_PUBLIC_SANTA_NONE: process.env.NEXT_PUBLIC_SANTA_NONE,
	};

	return NextResponse.json(envVars);
}
