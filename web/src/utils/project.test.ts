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
				query: { productRoot: "Guidance", statusSlug: "indevelopment" },
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
				query: { productRoot: "Guidance" },
			});

			expect(result).toStrictEqual({
				redirect: {
					destination: "/indicators/ind60-nxt-129-complete-test",
					permanent: true,
				},
			});
		});

		describe.each([
			["indicators", "Other"],
			["guidance", "Guidance"],
		])("", (expectedGroupSlug, projectGroup) => {
			it.each([
				["InProgress", "indevelopment"],
				["Proposed", "awaiting-development"],
				["TopicSelection", "prioritisation"],
				["Discontinued", "discontinued"],
			])(
				"should redirect to correct url path for status %s and status slug %s when url path does not match project status",
				async (status, expectedStatusSlug) => {
					axiosJSONMock.reset();
					axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
						...ind60,
						status,
						reference: "gid-abc123",
						projectGroup,
					});
					addDefaultJSONFeedMocks();

					const result = await validateRouteParams({
						params: {
							slug: "gid-abc123",
						},
						resolvedUrl: `/${expectedGroupSlug}/incorrect-status-slug/gid-abc123/documents`,
						query: {
							productRoot: expectedGroupSlug,
							statusSlug: "incorrect-status-slug",
						},
					});

					expect(result).toStrictEqual({
						redirect: {
							destination: `/${expectedGroupSlug}/${expectedStatusSlug}/gid-abc123/documents`,
							permanent: true,
						},
					});
				}
			);

			it.each([
				["InProgress", "indevelopment"],
				["Proposed", "awaiting-development"],
				["TopicSelection", "prioritisation"],
				["Discontinued", "discontinued"],
			])(
				"should redirect to correct url path for status %s and status slug %s when group slug is incorrect",
				async (status, expectedStatusSlug) => {
					axiosJSONMock.reset();
					axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
						...ind60,
						status,
						reference: "gid-abc123",
						projectGroup,
					});
					addDefaultJSONFeedMocks();

					const result = await validateRouteParams({
						params: {
							slug: "gid-abc123",
						},
						resolvedUrl: `/incorrect-group-slug/${expectedStatusSlug}/gid-abc123/documents`,
						query: {
							productRoot: "incorrect-group-slug",
							statusSlug: expectedStatusSlug,
						},
					});

					expect(result).toStrictEqual({
						redirect: {
							destination: `/${expectedGroupSlug}/${expectedStatusSlug}/gid-abc123/documents`,
							permanent: true,
						},
					});
				}
			);

			it.each([
				["InProgress", "indevelopment"],
				["Proposed", "awaiting-development"],
				["TopicSelection", "prioritisation"],
				["Discontinued", "discontinued"],
			])(
				"should redirect to correct url path for status %s and status slug %s when both group slug and status slug are incorrect",
				async (status, expectedStatusSlug) => {
					axiosJSONMock.reset();
					axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
						...ind60,
						status,
						reference: "gid-abc123",
						projectGroup,
					});
					addDefaultJSONFeedMocks();

					const result = await validateRouteParams({
						params: {
							slug: "gid-abc123",
						},
						resolvedUrl: `/incorrect-group-slug/incorrect-status-slug/gid-abc123/documents`,
						query: {
							productRoot: "incorrect-group-slug",
							statusSlug: "incorrect-status-slug",
						},
					});

					expect(result).toStrictEqual({
						redirect: {
							destination: `/${expectedGroupSlug}/${expectedStatusSlug}/gid-abc123/documents`,
							permanent: true,
						},
					});
				}
			);
		});

		it("should return a permanent redirect object to the published product URL from /documents when project status is 'Complete'", async () => {
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
				resolvedUrl:
					"/indicators/indevelopment/ind60-resource-products/documents",
				query: { productRoot: "Indicators" },
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
