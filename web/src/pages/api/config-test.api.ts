import { NextApiRequest, NextApiResponse } from "next";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";
import type { ServerConfig } from "@/config";

interface ConfigTestResponse {
	message: string;
	serverConfigKeys: string[];
	serverConfigError?: string | null;
	publicConfigKeys: string[];
	serverFeeds: string[];
	serverCache: string[];
	jotFormConfigured: {
		server: boolean;
		public: boolean;
	};
	developmentMode?: boolean;
	note?: string;
	serverConfigDiagnostics?: {
		hasCacheConfig: boolean;
		hasFeedsConfig: boolean;
		cacheKeyPrefix?: string;
		feedsAvailable: string[];
		jotFormApiKeyConfigured: boolean;
		// Enhanced diagnostics
		cacheConfig?: {
			keyPrefix?: string;
			filePath?: string;
			defaultTTL?: number;
			longTTL?: number;
			refreshThreshold?: number;
		};
		feedsConfig?: {
			publications?: { origin?: string; hasApiKey: boolean };
			inDev?: { origin?: string; hasApiKey: boolean };
			jotForm?: { origin?: string; hasApiKey: boolean };
		};
		proxyInfo: {
			isProxy: boolean;
			canAccessProperties: boolean;
			explanation: string;
		};
	} | null;
}

interface ErrorResponse {
	error: string;
	message: string;
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ConfigTestResponse | ErrorResponse>
): void {
	// Security: Only allow in development and test environments
	const nodeEnv = process.env.NODE_ENV;
	if (nodeEnv === "production") {
		res.status(404).end();
		return;
	}

	// Additional security: Check for specific test/dev indicators
	const isDevelopment = nodeEnv === "development";
	const isTest = nodeEnv === "test";
	const hasTestIndicator = process.env.ENABLE_CONFIG_TEST === "true";

	if (!isDevelopment && !isTest && !hasTestIndicator) {
		res.status(404).end();
		return;
	}
	// This API endpoint will help us test if server config loading works
	let serverConfig: ServerConfig | null = null;
	let serverConfigError: string | null = null;

	try {
		serverConfig = serverRuntimeConfig as ServerConfig;
	} catch (error) {
		serverConfigError =
			error instanceof Error
				? error.message
				: "Unknown error loading server config";
		console.warn("Server config not available in development mode:", error);
	}

	const publicConfig = publicRuntimeConfig as unknown as Record<
		string,
		unknown
	>;

	res.status(200).json({
		message: "Config test endpoint",
		serverConfigKeys: serverConfig ? Object.keys(serverConfig) : [],
		serverConfigError,
		publicConfigKeys: Object.keys(publicConfig || {}),
		serverFeeds: serverConfig?.feeds ? Object.keys(serverConfig.feeds) : [],
		serverCache: serverConfig?.cache ? Object.keys(serverConfig.cache) : [],
		jotFormConfigured: {
			server: !!serverConfig?.feeds?.jotForm?.apiKey,
			public: !!(publicConfig as { jotForm?: { baseURL?: string } })?.jotForm
				?.baseURL,
		},
		developmentMode: process.env.NODE_ENV === "development",
		note: serverConfigError
			? 'Server config unavailable in development mode - this is normal. Run "npm run build && npm start" to test server config.'
			: undefined,
		// Enhanced diagnostics for server config
		serverConfigDiagnostics: serverConfig
			? {
					hasCacheConfig: !!serverConfig.cache,
					hasFeedsConfig: !!serverConfig.feeds,
					cacheKeyPrefix: serverConfig.cache?.keyPrefix,
					feedsAvailable: serverConfig.feeds
						? Object.keys(serverConfig.feeds)
						: [],
					jotFormApiKeyConfigured: !!serverConfig.feeds?.jotForm?.apiKey,
					// Enhanced diagnostics - actual config values
					cacheConfig: serverConfig.cache
						? {
								keyPrefix: serverConfig.cache.keyPrefix,
								filePath: serverConfig.cache.filePath,
								defaultTTL: serverConfig.cache.defaultTTL,
								longTTL: serverConfig.cache.longTTL,
								refreshThreshold: serverConfig.cache.refreshThreshold,
						  }
						: undefined,
					feedsConfig: serverConfig.feeds
						? {
								publications: serverConfig.feeds.publications
									? {
											origin: serverConfig.feeds.publications.origin,
											hasApiKey: !!serverConfig.feeds.publications.apiKey,
									  }
									: undefined,
								inDev: serverConfig.feeds.inDev
									? {
											origin: serverConfig.feeds.inDev.origin,
											hasApiKey: !!serverConfig.feeds.inDev.apiKey,
									  }
									: undefined,
								jotForm: serverConfig.feeds.jotForm
									? {
											origin: "N/A (jotForm uses public config for baseURL)",
											hasApiKey: !!serverConfig.feeds.jotForm.apiKey,
									  }
									: undefined,
						  }
						: undefined,
					proxyInfo: {
						isProxy: typeof serverConfig === "object" && serverConfig !== null,
						canAccessProperties: !!serverConfig.cache || !!serverConfig.feeds,
						explanation:
							"serverConfigKeys is empty because serverRuntimeConfig is a Proxy object. Object.keys() doesn't enumerate Proxy properties, but the config values are accessible as shown above.",
					},
			  }
			: null,
	});
}
