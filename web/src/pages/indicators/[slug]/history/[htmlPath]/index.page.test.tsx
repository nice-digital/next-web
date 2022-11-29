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

import HistoryHTMLPage, {
	getServerSideProps,
	HistoryHTMLPageProps,
} from "./index.page";

type HistoryPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	htmlPath: string;
}>;

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

// /indicators/ind6-new-indicator-product-1/history/html-content

describe("/indicators/[slug]/history.page", () => {
	const slug = "ind6-new-indicator-product-1";
	const htmlPath = "html-content-2";

	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}/history/${htmlPath}`,
		}));
		axiosMock.reset();

		axiosMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProductWithInDevReference);
		axiosMock
			.onGet(new RegExp(IndevFeedPath.ProjectDetail))
			.reply(200, mockProject);
		axiosMock
			.onGet(new RegExp(FeedPath.IndicatorSubTypes))
			.reply(200, mockIndicatorSubTypes);

		jest.resetModules();
	});

	describe("HistoryPage", () => {
		let props: HistoryHTMLPageProps;
		beforeEach(async () => {
			const context = {
				params: { slug: slug, htmlPath: htmlPath },
			} as HistoryPageGetServerSidePropsContext;

			props = (
				(await getServerSideProps(context)) as {
					props: HistoryHTMLPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<HistoryHTMLPage {...props} />);

			// eslint-disable-next-line testing-library/no-debugging-utils
			screen.debug();
			expect(document.body).toMatchSnapshot();
		});
	});
});
