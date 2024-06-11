import { type NextApiRequest, type NextApiResponse } from "next";

import { publicRuntimeConfig } from "@/config";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
): void {
	if (publicRuntimeConfig.environment === "live") {
		res.send(`User-agent: bingbot
Crawl-delay: 1
User-agent: *
Allow: /`);
	} else {
		res.send(`User-agent: *
Disallow: /
`);
	}
}
