import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import ToolsAndResourcesListPage, {
	getServerSideProps,
	ToolsAndResourcesListPageProps,
} from "./index.page";

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

(useRouter as jest.Mock).mockReturnValue({
	asPath: "/guidance/ng100/resources",
});

const getServerSidePropsContext = {
	params: {
		slug: "ng100",
	},
	resolvedUrl: "/guidance/ng100/resources",
	query: { productRoot: "guidance" },
} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("Publication tools and resources page", () => {
	describe("getServerSideProps", () => {
		it("should return not found when no tools and resources", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ng100,
				RelatedResourceList: undefined,
			});
			addDefaultJSONFeedMocks();

			const result = await getServerSideProps(getServerSidePropsContext);

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				"No tools and resources found for product NG100"
			);

			expect(result).toStrictEqual({
				notFound: true,
			});
		});

		it("should return redirect when product has been withdrawn", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ng100,
				ProductStatus: "Withdrawn",
			});
			addDefaultJSONFeedMocks();

			const result = await getServerSideProps(getServerSidePropsContext);

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

			const result = await getServerSideProps(getServerSidePropsContext);

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

		it("should return props", async () => {
			const result = await getServerSideProps(getServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});
	});

	describe("ToolsAndResourcesListPage", () => {
		let props: ToolsAndResourcesListPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: ToolsAndResourcesListPageProps;
				}
			).props;
		});

		it("should match snapshot", async () => {
			const { container } = render(<ToolsAndResourcesListPage {...props} />);
			expect(container).toMatchSnapshot();
		});

		describe("InfoAlert", () => {
			it("should not appear when alert is null", () => {
				render(<ToolsAndResourcesListPage {...props} />);
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
				render(<ToolsAndResourcesListPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});
	});
});
