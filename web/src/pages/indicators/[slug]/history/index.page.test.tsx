import { render, screen } from "@testing-library/react";
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
			asPath: `/indicators/history/${slug}#somewhere`,
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

	describe("IndicatorDetailPage", () => {
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
			console.log("testing!!!");
		});

		it("should match snapshot for main content", () => {
			render(<HistoryPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});
	});
});
