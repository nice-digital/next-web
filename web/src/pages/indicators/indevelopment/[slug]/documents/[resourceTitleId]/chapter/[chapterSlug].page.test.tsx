import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import ConvertedDocumentPage, {
	DocumentsChapterHTMLPageProps,
	getServerSideProps,
} from "./[chapterSlug].page";

const productRoot = "guidance",
	statusSlug = "topic-selection",
	resourceTitleId = "final-scope-html-conversion",
	slug = "gid-dg10086",
	chapterSlug = "recommendations",
	resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents/${resourceTitleId}/chapter/${chapterSlug}`,
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

type DocumentsChapterHTMLPagePropsContext = GetServerSidePropsContext<{
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

			expect(logger.info as jest.Mock).toHaveBeenCalledWith(
				`Could not find resource with id empty-conversion`
			);
		});

		it("should return not found when no converted document chapter matches the chapterSlug in the URL", async () => {
			const notFoundChapterSlug = "not-a-real-chapter";

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: slug,
						resourceTitleId: resourceTitleId,
						chapterSlug: notFoundChapterSlug,
					},
					query: { productRoot, statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(logger.warn as jest.Mock).toHaveBeenCalledWith(
				`Could not find resource HTML at /guidance/GID-DG10086/documents/final-scope-html-conversion/chapter/${notFoundChapterSlug}`
			);
		});
	});

	describe("DocumentsHTMLPage", () => {
		const slug = "gid-dg10086",
			resourceTitleId = "final-scope-html-conversion",
			productRoot = "guidance",
			statusSlug = "topic-selection",
			chapterSlug = "recommendations",
			resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents/${resourceTitleId}/chapter/${slug}/`,
			context: DocumentsChapterHTMLPagePropsContext = {
				params: { slug, resourceTitleId, chapterSlug },
				query: {
					productRoot,
					statusSlug,
				},
				resolvedUrl,
			} as unknown as DocumentsChapterHTMLPagePropsContext;

		let props: DocumentsChapterHTMLPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: DocumentsChapterHTMLPageProps;
				}
			).props;
			(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		});

		it("should match the snapshot for main content", () => {
			render(<ConvertedDocumentPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		describe("SEO", () => {
			it("should render page title with document name", () => {
				render(<ConvertedDocumentPage {...props} />);

				expect(document.title).toBe(
					"Final scope (html conversion) | Project documents | GID-DG10086 | Indicators"
				);
			});
		});

		describe("Breadcrumbs", () => {
			it("should render parent breadcrumb linking to the project overview", () => {
				render(<ConvertedDocumentPage {...props} />);
				expect(
					screen.queryByText("GID-DG10086", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", "/indicators/indevelopment/gid-dg10086");
			});

			it("should render resource title as current breadcrumb", () => {
				render(<ConvertedDocumentPage {...props} />);

				expect(
					screen.getByText("Final scope (html conversion)", {
						selector: ".breadcrumbs .breadcrumbs__crumb span",
					})
				).toBeInTheDocument();
			});
		});

		it("should render the converted document chapter title as a heading", () => {
			render(<ConvertedDocumentPage {...props} />);
			expect(
				screen.getByRole("heading", {
					level: 2,
					name: "Recommendations",
				})
			).toHaveTextContent("Recommendations");
		});

		it("should render document HTML string as HTML", () => {
			props.resource.htmlBody = "<p>Hello</p>";

			render(<ConvertedDocumentPage {...props} />);
			expect(screen.getByText("Hello")).toHaveProperty("tagName", "P");
		});
	});
});
