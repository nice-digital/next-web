import { type NextApiRequest, type NextApiResponse } from "next";

import { publicRuntimeConfig } from "@/config";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
): void {
	if (publicRuntimeConfig.denyRobots === true) {
		res.send(`User-agent: *
Disallow: /
	`);
	} else {
		res.send(`User-agent: bingbot
Crawl-delay: 1
User-agent: *
Allow: /
	`);
	}
}
