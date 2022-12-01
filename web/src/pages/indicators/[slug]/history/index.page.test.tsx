import { render, screen, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath as IndevFeedPath } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockProject from "@/mockData/inDev/feeds/projects/ProjectDetail.json";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator-with-indev-reference.json";

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

describe("/history/index.page", () => {
	const slug = "ind6-new-indicator-product-1";

	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}/history`,
		}));
		axiosMock.reset();

		axiosMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, mockProduct);
		axiosMock
			.onGet(new RegExp(IndevFeedPath.ProjectDetail))
			.reply(200, mockProject);

		axiosMock
			.onGet(new RegExp(FeedPath.IndicatorSubTypes))
			.reply(200, mockIndicatorSubTypes);

		jest.resetModules();
	});

	describe("HistoryPage", () => {
		let props: HistoryPageProps;
		beforeEach(async () => {
			const context = {
				params: { slug: slug },
			} as HistoryPageGetServerSidePropsContext;

			props = (
				(await getServerSideProps(context)) as {
					props: HistoryPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<HistoryPage {...props} />);
			expect(document.body).toMatchSnapshot();
			// eslint-disable-next-line testing-library/no-debugging-utils
			// screen.debug();
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
			const result = await getServerSideProps({
				params: { slug },
				resolvedUrl: `/indicators/${slug}/history`,
			} as HistoryPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		it("should return correct groupSections", async () => {
			const result = (await getServerSideProps({
				params: { slug },
				resolvedUrl: `/indicators/${slug}/history`,
			} as HistoryPageGetServerSidePropsContext)) as {
				props: HistoryPageProps;
			};

			const { groupSections } = result.props as HistoryPageProps;

			expect(groupSections).toHaveLength(11);
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

			const notFoundResult = (await getServerSideProps({
				params: { slug },
				resolvedUrl: `/indicators/${slug}/history`,
			} as HistoryPageGetServerSidePropsContext)) as {
				props: HistoryPageProps;
			};

			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});
});
