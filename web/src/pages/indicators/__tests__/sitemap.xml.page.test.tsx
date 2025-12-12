import { GetServerSidePropsContext } from "next";

import { SearchResultsSuccess } from "@nice-digital/search-client";

import { getServerSideProps } from "../sitemap.xml.page";

jest.mock("@nice-digital/search-client", () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const sampleData = require("@/mockData/search/indicators.json") as {
		sampleData: SearchResultsSuccess;
	};

	const originalModule = jest.requireActual("@nice-digital/search-client");

	return {
		__esModule: true,
		...originalModule,
		search: jest.fn(() => sampleData),
	};
});

describe("Indicators sitemap XML", () => {
	it("should exclude withdrawn products and non-indicators from sitemap", async () => {
		const setHeader = jest.fn(),
			write = jest.fn(),
			end = jest.fn();

		await getServerSideProps({
			res: {
				setHeader,
				write,
				end,
			},
		} as unknown as GetServerSidePropsContext);

		expect(write.mock.calls[0][0]).toMatchSnapshot();
	});
});
