// @ts-check

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
};

module.exports = nextConfig;
