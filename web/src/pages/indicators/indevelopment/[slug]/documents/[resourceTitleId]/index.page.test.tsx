import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import DocumentsHTMLPage, {
	DocumentHTMLPageProps,
	getServerSideProps,
} from "./index.page";

const productRoot = "indicators",
	statusSlug = "indevelopment",
	resourceTitleId = "html-content-2",
	slug = "gid-ta10730",
	resolvedUrl = `/${productRoot}/${statusSlug}/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot, statusSlug },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

jest.mock("@/logger", () => ({
	logger: { warn: jest.fn(), info: jest.fn() },
}));

type DocumentHTMLPagePropsContext = GetServerSidePropsContext<{
	slug: string;
	resourceTitleId: string;
}>;

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

		it("should return not found when no resource matches resourceTitleId in URL", async () => {
			const notFoundResourceTitleId = "non-existent-html-content";
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ta10730",
						resourceTitleId: notFoundResourceTitleId,
					},
					query: { productRoot: "guidance", statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});
		});
	});
});

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
					query: { productRoot, statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found when no resources match resourceTitleId in URL", async () => {
			const notFoundResourceTitleId = "non-existent-html-content";
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ta10730",
						resourceTitleId: notFoundResourceTitleId,
					},
					query: { productRoot: "guidance", statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found if the resource HTML and resource links are empty", async () => {
			axiosJSONMock.reset();
			axiosJSONMock
				.onGet(new RegExp("/guidance/GID-TA10730/documents/html-content"))
				.reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});
			addDefaultJSONFeedMocks();

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ta10730",
						resourceTitleId: "html-content",
					},
					query: { productRoot: "guidance", statusSlug },
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(logger.warn as jest.Mock).toHaveBeenCalledWith(
				"Could not find resource HTML at /guidance/GID-TA10730/documents/html-content"
			);
		});

		it.todo("should return props for valid documents");
	});

	describe("DocumentsHTMLPage", () => {
		const slug = "gid-ta10730",
			resourceTitleId = "html-content-5",
			productRoot = "guidance",
			statusSlug = "indevelopment",
			resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents/${resourceTitleId}`,
			context: DocumentHTMLPagePropsContext = {
				params: { slug, resourceTitleId },
				query: {
					productRoot,
					statusSlug,
				},
				resolvedUrl,
			} as unknown as DocumentHTMLPagePropsContext;

		let props: DocumentHTMLPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: DocumentHTMLPageProps;
				}
			).props;
			(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		});

		it("should match snapshot for main content", () => {
			render(<DocumentsHTMLPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		describe("SEO", () => {
			it("should render page title with document name", () => {
				render(
					<DocumentsHTMLPage
						{...props}
						resource={{ title: "Test resource title", resourceFileHTML: "" }}
					/>
				);

				expect(document.title).toBe(
					"Test resource title | Project documents | GID-TA10730 | Indicators | Standards and Indicators"
				);
			});
		});

		describe("Breadcrumbs", () => {
			it("should render parent breadcrumb linking to the project overview", () => {
				render(<DocumentsHTMLPage {...props} />);
				expect(
					screen.queryByText("GID-TA10730", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", "/indicators/indevelopment/gid-ta10730");
			});

			it("should render resource title as current breadcrumb", () => {
				render(
					<DocumentsHTMLPage
						{...props}
						resource={{ title: "Test resource title", resourceFileHTML: "" }}
					/>
				);

				expect(
					screen.getByText("Test resource title", {
						selector: ".breadcrumbs .breadcrumbs__crumb span",
					})
				).toBeInTheDocument();
			});
		});

		it("should render the resource title as a heading", () => {
			render(
				<DocumentsHTMLPage
					{...props}
					resource={{
						resourceFileHTML: "",
						title: "Test resource title",
					}}
				/>
			);
			expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
				"Test resource title"
			);
		});

		it("should render resource links ", () => {
			const mockResourceLinks = [
				{
					title: "A resource file",
					href: "/indicators/indevelopment/gid-ta10730/downloads/gid-ta10730-a-resource-file.pdf",
					fileTypeName: "PDF",
					fileSize: 168753,
					date: "2021-11-03T15:59:00",
					type: "Invitation to participate",
				},
				{
					title: "Another resource file",
					href: "/indicators/indevelopment/gid-ta10730/downloads/gid-ta10730-another-resource-file.pdf",
					fileTypeName: "PDF",
					fileSize: 228170,
					date: "2022-09-22T00:00:00",
					type: "Invitation to participate",
				},
			];
			render(
				<DocumentsHTMLPage {...props} resourceLinks={mockResourceLinks} />
			);

			const resourceFile1 = screen.getByRole("link", {
				name: "A resource file (PDF, 169 kB)",
			});
			const resourceFile2 = screen.getByRole("link", {
				name: "Another resource file (PDF, 228 kB)",
			});

			expect(resourceFile1).toBeInTheDocument();
			expect(resourceFile1).toHaveAttribute(
				"href",
				"/indicators/indevelopment/gid-ta10730/downloads/gid-ta10730-a-resource-file.pdf"
			);

			expect(resourceFile2).toBeInTheDocument();
			expect(resourceFile2).toHaveAttribute(
				"href",
				"/indicators/indevelopment/gid-ta10730/downloads/gid-ta10730-another-resource-file.pdf"
			);
		});

		it("should render document HTML string as HTML", () => {
			render(
				<DocumentsHTMLPage
					{...props}
					resource={{
						resourceFileHTML: "<p>hello</p>",
						title: "anything",
					}}
				/>
			);
			expect(screen.getByText("hello")).toHaveProperty("tagName", "P");
		});
	});
});
