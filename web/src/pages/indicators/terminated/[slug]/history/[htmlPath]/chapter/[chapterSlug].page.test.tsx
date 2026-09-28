import { render, screen } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/publications/types";
import ind999 from "@/mockData/publications/newfeeds/product/ind999.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import HistoryChapterHTMLPage, {
	getServerSideProps,
	HistoryChapterHTMLPageProps,
} from "./[chapterSlug].page";

type HistoryChapterHTMLPageGetServerSidePropsContext =
	GetServerSidePropsContext<{
		slug: string;
		htmlPath: string;
		chapterSlug: string;
	}>;

const slug = "ind999-indicator-history-tab-html-conversion",
	htmlPath = "html-conversion",
	productRoot = "indicators",
	chapterSlug = "the-technologies",
	resolvedUrl = `/${productRoot}/terminated/${slug}/history/${htmlPath}/chapter/${chapterSlug}`,
	context = {
		params: { slug, htmlPath, chapterSlug },
		resolvedUrl,
		query: { productRoot },
	} as unknown as HistoryChapterHTMLPageGetServerSidePropsContext;

describe("/indicators/terminated/[slug]/history/[htmlPath]/chapter/[chapterSlug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: resolvedUrl,
		});

		// Override ind999 to have Terminated status so the /terminated/ URL path matches
		axiosJSONMock.reset();
		axiosJSONMock
			.onGet(new RegExp(FeedPath.ProductDetail + "IND999", "i"))
			.reply(200, {
				...ind999,
				ProductStatus: "Terminated",
			});
		addDefaultJSONFeedMocks();
	});

	describe("getServerSideProps", () => {
		it("should return correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return a not found if resource title id doesn't match the htmlPath param", async () => {
			const wrongHtmlPath = "non-existent-html-1";

			const notFoundResult = await getServerSideProps({
				...context,
				params: { slug, htmlPath: wrongHtmlPath, chapterSlug },
				resolvedUrl: `/${productRoot}/terminated/${slug}/history/${wrongHtmlPath}`,
			} as HistoryChapterHTMLPageGetServerSidePropsContext);

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return a not found if there are no panels of type 'History'", async () => {
			const notFoundResult = await getServerSideProps({
				...context,
				// Process and methods guides don't have history so a good product type to use here
				resolvedUrl: "/process/pmg20/history",
				params: {
					slug: "pmg20",
					htmlPath,
					chapterSlug,
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
				params: { slug, htmlPath: "not-found", chapterSlug },
			});

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});

	describe("HistoryChapterHTMLPage", () => {
		let props: HistoryChapterHTMLPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: HistoryChapterHTMLPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<HistoryChapterHTMLPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the converted document chapter title as a heading", () => {
			render(<HistoryChapterHTMLPage {...props} />);
			expect(
				screen.getByRole("heading", { level: 2, name: "2 The technologies" })
			).toBeInTheDocument();
		});

		it("should display the lastUpdated date", () => {
			render(<HistoryChapterHTMLPage {...props} />);

			expect(
				screen.getByText("This page was last updated on")
			).toBeInTheDocument();

			const time = screen.queryAllByText("19 August 2025", {
				selector: "time",
			})[0];
			expect(time).toHaveAttribute("dateTime", "2025-08-19");
		});

		describe("Breadcrumbs", () => {
			it("should render home breadcrumb linking to the homepage", () => {
				render(<HistoryChapterHTMLPage {...props} />);
				expect(
					screen.queryByText("Home", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", "/");
			});

			it("should render history breadcrumb linking to the product history page", () => {
				render(<HistoryChapterHTMLPage {...props} />);
				expect(
					screen.queryByText("History", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", `/${productRoot}/terminated/${slug}/history`);
			});

			it("should render given title as current page breadcrumb without link", () => {
				render(<HistoryChapterHTMLPage {...props} />);
				expect(
					screen.getByText("Html conversion document", {
						selector: ".breadcrumbs span",
					})
				).toBeInTheDocument();
			});
		});

		describe("InfoAlert", () => {
			it("should not appear when alert is null or undefined", () => {
				const propsWithoutAlert = {
					...props,
					product: {
						...props.product,
						alert: null,
					},
				};
				render(<HistoryChapterHTMLPage {...propsWithoutAlert} />);
				expect(screen.queryByText("Info alert")).not.toBeInTheDocument();
			});

			it("should appear when we have an alert", () => {
				const propsWithAlert = {
					...props,
					product: {
						...props.product,
						alert: "Info alert",
					},
				};
				render(<HistoryChapterHTMLPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});
	});
});
