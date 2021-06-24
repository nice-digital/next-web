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
	// Add page.tsx
	pageExtensions: ["page.tsx", "api.tsx"],
	webpack: (config, { webpack }) => {
		// config.plugins.unshift(
		// 	new webpack.IgnorePlugin({
		// 		resourceRegExp: /\.test\.(ts|tsx)$/,
		// 		contextRegExp: /.*/,
		// 	})
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({ resourceRegExp: /\.test\.[tj]sx?$/ })
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({
		// 		checkResource(resource, context) {
		// 			const isFileMatch = /\.test\.(ts|tsx)$/.test(resource);
		// 			console.log(resource, context, isFileMatch);
		// 			if (isFileMatch) return false;

		// 			const isFolderMatch = /__tests__/.test(resource);
		// 			console.log(resource, context, isFolderMatch);
		// 			if (isFolderMatch) return false;

		// 			//console.log(resource, /\.test\.(ts|tsx)$/.test(resource));
		// 			return undefined;
		// 		},
		// 	})
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({
		// 		resourceRegExp: /__tests__/g,
		// 	})
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({
		// 		resourceRegExp: /.*\.test(\.).*(ts|tsx)$/,
		// 		contextRegExp: /.*/,
		// 	})
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({
		// 		resourceRegExp: /\.test.*/,
		// 	})
		// );
		// config.plugins.push(
		// 	new webpack.IgnorePlugin({
		// 		resourceRegExp: /.*/,
		// 		contextRegExp: /__tests__/,
		// 	})
		// );
		//console.log(config.plugins);
		return config;
	},
};

module.exports = nextConfig;
