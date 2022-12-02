import { render, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath as IndevFeedPath } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockProject from "@/mockData/inDev/feeds/projects/ProjectDetail.json";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator-with-indev-reference.json";
import mockProductTypes from "@/mockData/publications/feeds/producttypes.json";

import HistoryPage, {
	getServerSideProps,
	HistoryPageProps,
} from "./index.page";

type HistoryPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

describe("/indicators/[slug]/history", () => {
	const slug = "ind6-new-indicator-product-1",
		productRoot = "indicators",
		resolvedUrl = `/${productRoot}/${slug}/history`,
		context: HistoryPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
			},
			resolvedUrl,
		} as unknown as HistoryPageGetServerSidePropsContext;

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		axiosMock.reset();

		axiosMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProduct)
			.onGet(new RegExp(IndevFeedPath.ProjectDetail))
			.reply(200, mockProject)
			.onGet(new RegExp(FeedPath.IndicatorSubTypes))
			.reply(200, mockIndicatorSubTypes)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes);

		jest.resetModules();
	});

	describe("HistoryPage", () => {
		let props: HistoryPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: HistoryPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<HistoryPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<HistoryPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`History | ${mockProduct.Id} | Indicators | Standards and Indicators`
				);
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return notFound when there are no history panels", async () => {
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

			const notFoundResult = (await getServerSideProps(context)) as {
				props: HistoryPageProps;
			};

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});
});
