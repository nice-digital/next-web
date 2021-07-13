import nextConfig from "./../../../next.config";

const getConfig = (): unknown => ({
	publicRuntimeConfig: nextConfig.publicRuntimeConfig,
	serverRuntimeConfig: nextConfig.serverRuntimeConfig,
});

export default getConfig;
