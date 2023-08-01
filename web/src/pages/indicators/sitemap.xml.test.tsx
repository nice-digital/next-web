import { GetServerSidePropsContext } from "next";

import { getServerSideProps } from "./sitemap.xml";

jest.mock("@/feeds/publications/publications", () => {
	const originalModule = jest.requireActual(
		"@/feeds/publications/publications"
	);

	return {
		__esModule: true,
		...originalModule,
		getAllProducts: jest.fn(() => [
			{
				title: "Test published indicator 1",
				id: "IND1",
				productGroup: "Other",
				lastModified: "2022-10-12T07:57:45.0879965Z",
				productStatus: "Published",
				productType: "IND",
			},
			{
				title: "Test withdrawn indicator",
				id: "IND2",
				productGroup: "Other",
				productStatus: "Withdrawn",
				productType: "IND",
			},
			{
				title: "Test published indicator 2",
				id: "IND3",
				productGroup: "Other",
				lastModified: "2021-11-30",
				productStatus: "Published",
				productType: "IND",
			},
			{
				title: "Test guidance",
				id: "CG1",
				productGroup: "Guidance",
				productStatus: "Published",
				productType: "CG",
			},
		]),
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
