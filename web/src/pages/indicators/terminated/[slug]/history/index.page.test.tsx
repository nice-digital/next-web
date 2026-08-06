import { render, screen, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ind999 from "@/mockData/publications/newfeeds/product/ind999.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import HistoryPage, {
	getServerSideProps,
	HistoryPageProps,
} from "./index.page";

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

type HistoryPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

describe("/indicators/terminated/[slug]/history", () => {
	const slug = "ind999-indicator-history-tab-html-conversion",
		productRoot = "indicators",
		resolvedUrl = `/${productRoot}/terminated/${slug}/history`,
		context: HistoryPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
			},
			resolvedUrl,
		} as unknown as HistoryPageGetServerSidePropsContext;

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });

		// Override ind999 to have Terminated status so the /terminated/ URL path matches
		axiosJSONMock.reset();
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail + "IND999", "i")).reply(200, {
			...ind999,
			ProductStatus: "Terminated",
		});
		addDefaultJSONFeedMocks();
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
				expect(document.title).toEqual(`History | IND999 | Indicators`);
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
				render(<HistoryPage {...propsWithoutAlert} />);
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
				render(<HistoryPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return notFound when there are no history panels", async () => {
			expect(
				await getServerSideProps({
					...context,
					// Process and methods guides don't have history so a good product type to use here
					resolvedUrl: "/process/pmg20/history",
					params: {
						slug: "pmg20",
					},
					query: {
						productRoot: "process",
					},
				})
			).toStrictEqual({ notFound: true });
		});
	});
});
