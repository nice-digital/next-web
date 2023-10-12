import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import ConvertedDocumentPage, {
	ConvertedDocumentPageProps,
	getServerSideProps,
} from "./[chapterSlug].page";

const productRoot = "guidance",
	statusSlug = "topic-selection",
	resourceTitleId = "final-scope-html-conversion",
	slug = "gid-dg10086",
	chapterSlug = "index",
	resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/converteddocument/${resourceTitleId}/${chapterSlug}`,
	getServerSidePropsContext = {
		params: {
			slug,
			resourceTitleId,
			chapterSlug,
		},
		resolvedUrl,
		query: { productRoot, statusSlug },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

jest.mock("@/logger", () => ({
	logger: { warn: jest.fn(), info: jest.fn() },
}));

type ConvertedDocumentPagePropsContext = GetServerSidePropsContext<{
	slug: string;
	resourceTitleId: string;
	chapterSlug: string;
}>;

describe("[chapterSlug].page", () => {
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
						chapterSlug: chapterSlug,
					},
					query: { productRoot, statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found when no converted document matches the resourceTitleId in the URL and html property is empty", async () => {
			const notFoundResourceTitleId = "empty-conversion";

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: slug,
						resourceTitleId: notFoundResourceTitleId,
						chapterSlug: chapterSlug,
					},
					query: { productRoot, statusSlug },
					resolvedUrl,
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(logger.warn as jest.Mock).toHaveBeenCalledWith(
				`Could not find converted document with id empty-conversion`
			);
		});
	});

	describe("DocumentsHTMLPage", () => {
		const slug = "gid-dg10086",
			resourceTitleId = "final-scope-html-conversion",
			productRoot = "guidance",
			statusSlug = "topic-selection",
			chapterSlug = "index",
			resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/converteddocument/${resourceTitleId}/${slug}/`,
			context: ConvertedDocumentPagePropsContext = {
				params: { slug, resourceTitleId, chapterSlug },
				query: {
					productRoot,
					statusSlug,
				},
				resolvedUrl,
			} as unknown as ConvertedDocumentPagePropsContext;

		let props: ConvertedDocumentPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: ConvertedDocumentPageProps;
				}
			).props;
			(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		});

		it("should match snapshot for main content", () => {
			render(<ConvertedDocumentPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});
	});
});
