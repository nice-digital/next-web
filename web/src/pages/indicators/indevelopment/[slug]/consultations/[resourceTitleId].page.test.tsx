import { GetServerSidePropsContext } from "next";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { getServerSideProps, type Params } from "./[resourceTitleId].page";

const productRoot = "indicators",
	resourceTitleId = "html-content-2",
	slug = "gid-ta11102",
	resolvedUrl = `/${productRoot}/indevelopment/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

jest.mock("@/logger", () => ({
	logger: { warn: jest.fn() },
}));

describe("[resourceTitleId].page", () => {
	describe("getServerSideProps", () => {
		it("should return not found when project doesn't exist", async () => {
			const notFoundIdSlug = "gid-abc123";

			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(404, {
				Message: "Not found",
				StatusCode: "NotFound",
			});
			addDefaultJSONFeedMocks();

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: notFoundIdSlug,
						resourceTitleId: resourceTitleId,
					},
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found when no consultation matches resourceTitleId in URL", async () => {
			const notFoundResourceTitleId = "non-existent-html-content";
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ind10244",
						resourceTitleId: notFoundResourceTitleId,
					},
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found if the consultation HTML is empty", async () => {
			axiosJSONMock.reset();
			axiosJSONMock
				.onGet(new RegExp("/guidance/GID-IND10243/consultation/html-content"))
				.reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});
			addDefaultJSONFeedMocks();

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ind10243",
						resourceTitleId: "html-content",
					},
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(logger.warn as jest.Mock).toHaveBeenCalledWith(
				"Consultation HTML not found at /guidance/GID-IND10243/consultation/html-content"
			);
		});

		it.todo("should return props for valid consultation");
	});

	describe("ConsultationHTMLPage", () => {
		describe("SEO", () => {
			it.todo("should render page title with consultation name");
		});

		describe("Breadcrumbs", () => {
			it.todo("should render parent breadcrumb to project overview");
			it.todo("should render consultation name as current breadcrumb");
		});

		it.todo("should render consultation HTML");
	});
});
