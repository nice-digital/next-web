import { render, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";
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

describe("/indicators/[slug]/history", () => {
	const slug = "ng100",
		productRoot = "guidance",
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
				expect(document.title).toEqual(`History | NG100 | Indicators`);
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return redirect when product has been withdrawn", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ng100,
				ProductStatus: "Withdrawn",
			});
			addDefaultJSONFeedMocks();

			const result = await getServerSideProps(context);

			expect(loggerInfoMock).toHaveBeenCalledWith(
				"Product with id NG100 has 'Withdrawn' status"
			);

			expect(result).toStrictEqual({
				redirect: {
					permanent: true,
					destination: "/guidance/ng100",
				},
			});
		});

		it("should return redirect when product has been temporarily withdrawn", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ng100,
				ProductStatus: "TemporarilyWithdrawn",
			});
			addDefaultJSONFeedMocks();

			const result = await getServerSideProps(context);

			expect(loggerInfoMock).toHaveBeenCalledWith(
				"Product with id NG100 has 'TemporarilyWithdrawn' status"
			);

			expect(result).toStrictEqual({
				redirect: {
					permanent: true,
					destination: "/guidance/ng100",
				},
			});
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
