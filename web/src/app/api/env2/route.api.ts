import { NextResponse } from 'next/server';

export async function GET() {
	console.log('GET /api/env2');
  const envVars = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_AUTH_ENVIRONMENT: process.env.NEXT_PUBLIC_AUTH_ENVIRONMENT,
    NEXT_PUBLIC_BUILD_NUMBER: process.env.NEXT_PUBLIC_BUILD_NUMBER,
  };

  return NextResponse.json(envVars);
}
