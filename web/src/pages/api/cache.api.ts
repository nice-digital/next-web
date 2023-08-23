import { type NextApiRequest, type NextApiResponse } from "next";

import { cache, getCacheKey } from "@/cache";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
): void {
	const action = req.query["action"];

    var expectedGroupKeys = ["publications", "indev" ];

	switch (action) {
		case "delete":
			// Delete an entry in the fs cache
			res.setHeader("Cache-Control", "no-store");

			// The request must contain groupKey and itemKey params, which correspond to the values in cache.ts
			if (req.query["groupKey"] && req.query["itemKey"]) {
				const groupKey = req.query["groupKey"] as string; // e.g. "publications"
				const itemKey = req.query["itemKey"] as string; // e.g. "/feeds/product/ind63"
				const cacheKey = getCacheKey(groupKey.toLowerCase(), itemKey.toLowerCase());

				if(expectedGroupKeys.includes(groupKey))
				{
				try {
					cache.del(cacheKey);
					res.status(200).json({
						message: `Successfully wiped cache for route: ${cacheKey}`,
					});
				} catch (err) {
					res.status(500).json({ message: `Error deleting cache: ${err}` });
				}
				}else {
					res.status(400).json({
						message:
							"Bad request! Did you supply the correct groupKey?",
					});
				}
			} else {
				res.status(400).json({
					message:
						"Bad request! Did you supply the groupKey and itemKey params?",
				});
			}
			break;
	}
}
