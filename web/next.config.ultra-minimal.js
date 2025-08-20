// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	pageExtensions: ["page.tsx", "api.ts"],
	poweredByHeader: false,
	typescript: {
		ignoreBuildErrors: process.env.NODE_ENV === "production",
	},
};

module.exports = nextConfig;
