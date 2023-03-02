import { FeedPath } from "@/feeds/inDev/types";
import ind60 from "@/mockData/inDev/project/ind60.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { validateRouteParams } from "./project";

describe("project utils", () => {
	describe("validateRouteParams", () => {
		it("should return not found when project is not found", async () => {
			const result = await validateRouteParams({
				params: {
					slug: "gid-abc123",
				},
				resolvedUrl: "/anything",
			});

			expect(result).toStrictEqual({
				notFound: true,
			});
		});

		it("should return a permanent redirect object to the published product URL when project status is 'Complete'", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
				...ind60,
				status: "Complete",
				reference: "IND60",
			});
			addDefaultJSONFeedMocks();

			const result = await validateRouteParams({
				params: {
					slug: "IND60",
				},
				resolvedUrl: "/indicators/indevelopment/ind60-resource-products",
			});

			expect(result).toStrictEqual({
				redirect: {
					destination: "/indicators/ind60-nxt-129-complete-test",
					permanent: true,
				},
			});
		});
	});
});
