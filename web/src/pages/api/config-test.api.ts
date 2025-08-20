import { NextApiRequest, NextApiResponse } from "next";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";
import type { ServerConfig } from "@/config";

interface ConfigTestResponse {
	message: string;
	serverConfigKeys: string[];
	publicConfigKeys: string[];
	serverFeeds: string[];
	serverCache: string[];
	jotFormConfigured: {
		server: boolean;
		public: boolean;
	};
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ConfigTestResponse>
): void {
	// This API endpoint will help us test if server config loading works
	const serverConfig = serverRuntimeConfig as ServerConfig;
	const publicConfig = publicRuntimeConfig as unknown as Record<
		string,
		unknown
	>;

	res.status(200).json({
		message: "Config test endpoint",
		serverConfigKeys: Object.keys(serverConfig || {}),
		publicConfigKeys: Object.keys(publicConfig || {}),
		serverFeeds: serverConfig?.feeds ? Object.keys(serverConfig.feeds) : [],
		serverCache: serverConfig?.cache ? Object.keys(serverConfig.cache) : [],
		jotFormConfigured: {
			server: !!serverConfig?.feeds?.jotForm?.apiKey,
			public: !!(publicConfig as { jotForm?: { baseURL?: string } })?.jotForm
				?.baseURL,
		},
	});
}
