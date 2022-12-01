import { render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath as IndevFeedPath } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockProject from "@/mockData/inDev/feeds/projects/ProjectDetail.json";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProductWithInDevReference from "@/mockData/publications/feeds/products/indicator-with-indev-reference.json";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";

import HistoryHTMLPage, {
	getServerSideProps,
	HistoryHTMLPageProps,
} from "./index.page";

type HistoryHTMLPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	htmlPath: string;
}>;

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

describe("/indicators/[slug]/history.page", () => {
	const slug = "ind6-new-indicator-product-1";
	const htmlPath = "html-content";
	const mockEditableHTML = "<p>some test html content</p>";

	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}/history/${htmlPath}`,
		}));
		axiosMock.reset();

		axiosMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProductWithInDevReference)
			.onGet(new RegExp(IndevFeedPath.ProjectDetail))
			.reply(200, mockProject)
			.onGet(new RegExp(FeedPath.IndicatorSubTypes))
			.reply(200, mockIndicatorSubTypes)
			.onGet(new RegExp(`/guidance/NG100/documents/${htmlPath}`))
			.reply(200, mockEditableHTML);

		jest.resetModules();
	});

	describe("HistoryPage", () => {
		let props: HistoryHTMLPageProps;
		beforeEach(async () => {
			const context = {
				params: { slug: slug, htmlPath: htmlPath },
			} as HistoryHTMLPageGetServerSidePropsContext;

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
			expect(screen.getByText("some test html content")).toBeInTheDocument();
		});

		it.each([
			[
				"Comments form (Word, 65 kB)",
				"/indicators/ind6-new-indicator-product-1/history/downloads/IND6-comments-form.doc",
			],
			[
				"Draft scope (PDF, 124 kB)",
				"/indicators/ind6-new-indicator-product-1/history/downloads/IND6-draft-scope.pdf",
			],
			[
				"Equality impact assessment (PDF, 233 kB)",
				"/indicators/ind6-new-indicator-product-1/history/downloads/IND6-equality-impact-assessment-8.pdf",
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

			const resource = arrayify(
				mockProject._embedded["nice.indev:panel-list"]._embedded[
					"nice.indev:panel"
				][13]._embedded["nice.indev:resource-list"]._embedded[
					"nice.indev:resource"
				]
			);

			const resourcePublishedDate = resource[0].PublishedDate;

			expect(
				screen.getByText("This page was last updated on")
			).toBeInTheDocument();

			const time = screen.getByText(
				formatDateStr(resourcePublishedDate as string),
				{
					selector: "time",
				}
			);
			expect(time).toHaveAttribute(
				"dateTime",
				stripTime(resourcePublishedDate as string)
			);
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props", async () => {
			const result = await getServerSideProps({
				params: { slug, htmlPath },
				resolvedUrl: `/indicators/${slug}/history/${htmlPath}`,
			} as HistoryHTMLPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		it("should return a not found if resource title id doesn't match the htmlPath param", async () => {
			const wrongHtmlPath = "non-existent-html-1";

			const notFoundResult = await getServerSideProps({
				params: { slug, htmlPath: wrongHtmlPath },
				resolvedUrl: `/indicators/${slug}/history/${htmlPath}`,
			} as HistoryHTMLPageGetServerSidePropsContext);

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return a not found if there are panels of type 'History'", async () => {
			const nonHistoryPanels = mockProject._embedded[
				"nice.indev:panel-list"
			]._embedded["nice.indev:panel"].filter(
				(panel) => panel.PanelType != "History"
			);

			axiosMock.onGet(new RegExp(IndevFeedPath.ProjectDetail)).reply(200, {
				...mockProject,
				_embedded: {
					"nice.indev:panel-list": {
						_embedded: {
							"nice.indev:panel": nonHistoryPanels,
						},
					},
				},
			});

			const notFoundResult = await getServerSideProps({
				params: { slug, htmlPath },
				resolvedUrl: `/indicators/${slug}/history/${htmlPath}`,
			} as HistoryHTMLPageGetServerSidePropsContext);

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if the resource html is null", async () => {
			axiosMock
				.onGet(new RegExp("/guidance/NG100/documents/html-content"))
				.reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});

			const notFoundResult = (await getServerSideProps({
				params: { slug, htmlPath },
				resolvedUrl: `/indicators/${slug}/history/${htmlPath}`,
			} as HistoryHTMLPageGetServerSidePropsContext)) as {
				props: HistoryHTMLPageProps;
			};

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});
});
