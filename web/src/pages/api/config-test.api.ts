import { NextApiRequest, NextApiResponse } from "next";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// This API endpoint will help us test if server config loading works
	const serverConfig = serverRuntimeConfig;
	const publicConfig = publicRuntimeConfig;

	res.status(200).json({
		message: "Config test endpoint",
		serverConfigKeys: Object.keys(serverConfig || {}),
		publicConfigKeys: Object.keys(publicConfig || {}),
		serverFeeds: (serverConfig as any)?.feeds
			? Object.keys((serverConfig as any).feeds)
			: [],
		serverCache: (serverConfig as any)?.cache
			? Object.keys((serverConfig as any).cache)
			: [],
		jotFormConfigured: {
			server: !!(serverConfig as any)?.feeds?.jotForm?.apiKey,
			public: !!(publicConfig as any)?.jotForm?.baseURL,
		},
	});
}
