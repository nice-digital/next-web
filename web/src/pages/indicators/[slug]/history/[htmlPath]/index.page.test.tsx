import { render, screen } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import HistoryHTMLPage, {
	getServerSideProps,
	HistoryHTMLPageProps,
} from "./index.page";

type HistoryHTMLPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	htmlPath: string;
}>;

const slug = "ng100",
	htmlPath = "html-content",
	productRoot = "guidance",
	resolvedUrl = `/${productRoot}/${slug}/history/${htmlPath}`,
	context = {
		params: { slug, htmlPath },
		resolvedUrl,
		query: { productRoot },
	} as unknown as HistoryHTMLPageGetServerSidePropsContext;

describe("/indicators/[slug]/history/[htmlPath]/index.page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: resolvedUrl,
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return a not found if resource title id doesn't match the htmlPath param", async () => {
			const wrongHtmlPath = "non-existent-html-1";

			const notFoundResult = await getServerSideProps({
				...context,
				params: { slug, htmlPath: wrongHtmlPath },
				resolvedUrl: `/indicators/${slug}/history/${wrongHtmlPath}`,
			} as HistoryHTMLPageGetServerSidePropsContext);

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return a not found if there are panels of type 'History'", async () => {
			const notFoundResult = await getServerSideProps({
				...context,
				// Process and methods guides don't have history so a good product type to use here
				resolvedUrl: "/process/pmg20/history",
				params: {
					slug: "pmg20",
					htmlPath,
				},
				query: {
					productRoot: "process",
				},
			});

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if the resource html is null", async () => {
			const notFoundResult = await getServerSideProps({
				...context,
				params: { slug, htmlPath: "not-found" },
			});

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});

	describe("HistoryHTMLPage", () => {
		let props: HistoryHTMLPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: HistoryHTMLPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<HistoryHTMLPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render html content from the endpoint", () => {
			render(<HistoryHTMLPage {...props} />);
			expect(
				screen.getByRole("heading", { level: 3, name: "How to comment" })
			).toBeInTheDocument();
		});

		it.each([
			[
				"Comments form (Word, 65 kB)",
				"/guidance/ng100/history/downloads/NG100-comments-form.doc",
			],
			[
				"Draft scope (PDF, 124 kB)",
				"/guidance/ng100/history/downloads/NG100-draft-scope.pdf",
			],
			[
				"Equality impact assessment (PDF, 233 kB)",
				"/guidance/ng100/history/downloads/NG100-equality-impact-assessment-8.pdf",
			],
		])(
			"should render resource links for %s with correct %s link and file info",
			(linkText, href) => {
				render(<HistoryHTMLPage {...props} />);


				const resourceLink = screen.getByText(linkText);

				expect(resourceLink).toBeInTheDocument();
				expect(resourceLink).toHaveAttribute("href", href);
			}
		);

		it("should display the lastUpdated date", () => {
			render(<HistoryHTMLPage {...props} />);

			expect(
				screen.getByText("This page was last updated on")
			).toBeInTheDocument();

			const time = screen.getByText("19 July 2016", {
				selector: "time",
			});
			expect(time).toHaveAttribute("dateTime", "2016-07-19");
		});

		describe("Breadcrumbs", () => {
			it("should render home breadcrumb linking to the homepage", () => {
				render(<HistoryHTMLPage {...props} />);
				expect(
					screen.queryByText("Home", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", "/");
			});

			it("should render history breadcrumb linking to the product history page", () => {
				render(<HistoryHTMLPage {...props} />);
				expect(
					screen.queryByText("History", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", `/${productRoot}/${slug}/history`);
			});

			it("should render given title as current page breadcrumb without link", () => {
				render(<HistoryHTMLPage {...props} />);
				expect(
					screen.getByText("Draft scope consultation", {
						selector: ".breadcrumbs span",
					})
				).toBeInTheDocument();
			});
		});

		describe("ConvertedDocument", () => {
			const convertedDocumentSlug = "ind999-indicator-history-tab-html-conversion",
				convertedDocumentHtmlPath = "html-conversion",
				convertedDocumentProductRoot = "indicators",
				convertedDocumentResolvedUrl = `/${convertedDocumentProductRoot}/${convertedDocumentSlug}/history/${convertedDocumentHtmlPath}`;

			beforeEach(async () => {
				props = (
					(await getServerSideProps({
						...context,
						params: { slug: convertedDocumentSlug, htmlPath: convertedDocumentHtmlPath },
						resolvedUrl: convertedDocumentResolvedUrl,
						query: { productRoot: convertedDocumentProductRoot }
					})) as {
						props: HistoryHTMLPageProps;
					}
				).props;
				(useRouter as jest.Mock).mockReturnValue({ asPath: convertedDocumentResolvedUrl });
			});

			it("should match snapshot for converted document", () => {
				render(<HistoryHTMLPage {...props} />);
				expect(document.body).toMatchSnapshot();
			});

			it("should render the converted document chapter title as a heading", () => {
				render(<HistoryHTMLPage {...props} />);
				expect(
					screen.getByRole("heading", { level: 2, name: "1 Recommendations" })
				).toBeInTheDocument();
			});

		});
	});
});
