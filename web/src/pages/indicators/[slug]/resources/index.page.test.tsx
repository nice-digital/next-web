import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";
import { axiosJSONMock, addDefaultJSONFeedMocks } from "@/test-utils/feeds";

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

		it("should return props", async () => {
			const result = await getServerSideProps(getServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});
	});

	describe("ToolsAndResourcesListPage", () => {
		it("should match snapshot", async () => {
			const { props } = (await getServerSideProps(
				getServerSidePropsContext
			)) as { props: ToolsAndResourcesListPageProps };

			const { container } = render(<ToolsAndResourcesListPage {...props} />);

			expect(container).toMatchSnapshot();
		});
	});
});
