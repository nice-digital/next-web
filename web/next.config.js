// @ts-check

/**
 * 'Best practice' security headers as per https://nextjs.org/docs/advanced-features/security-headers
 */
const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "Content-Security-Policy",
		value: "frame-ancestors 'none'", // TODO: Add a strong CSP
	},
];

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		// We run ESLint ourselves at the root of this monorepo
		ignoreDuringBuilds: true,
	},
	// Add page.tsx for test co-location, see https://github.com/vercel/next.js/issues/24067#issuecomment-867889207
	pageExtensions: ["page.tsx", "api.tsx"],
	// Don't send the x-powered-by header: we don't want to expose things like that.
	// https://nextjs.org/docs/api-reference/next.config.js/disabling-x-powered-by
	poweredByHeader: false,
	async headers() {
		return [
			{
				// Add common security headers to all pages
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
	future: {},
	experimental: {},
};

module.exports = nextConfig;
