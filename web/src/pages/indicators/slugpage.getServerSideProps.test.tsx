import { render } from "@testing-library/react";

import IndicatorsDetailsPage, {
	getServerSideProps,
	IndicatorsDetailsPageProps,
} from "./[slug].page";

import type { GetServerSidePropsContext } from "next";

jest.mock("@/feeds/publications/publications", () => {
	const originalModule = jest.requireActual(
		"@/feeds/publications/publications"
	);

	//Mock the getProductDetail export
	return {
		__esModule: true,
		...originalModule,
		getProductDetail: jest.fn(() => ({
			Title: "Test title 1",
			Id: "IND1",
		})),
	};
});

const props: Required<IndicatorsDetailsPageProps> = {
	slug: "/ind-1-test-title-1",
	id: "IND1",
	product: { Title: "/test", Id: "IND1" },
};

describe("IndicatorDetailPage", () => {
	it("should match snapshot for main content", () => {
		render(<IndicatorsDetailsPage {...props} />);

		expect(document.body).toMatchSnapshot();
	});
});

describe("getGetServerSidePropsFunc", () => {
	it("should return a correct props when supplied with an id", async () => {
		const result = await getServerSideProps({
			params: { slug: "ind1-test-title-1" },
		} as unknown as GetServerSidePropsContext);

		expect(result).toStrictEqual({
			props: {
				slug: "ind1-test-title-1",
				id: "ind1",
				product: { Id: "IND1", Title: "Test title 1" },
			},
		});
	});

	describe("Redirects", () => {
		it("should return permanent redirect object URL with incorrect title", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "ind1-incorrect-slug-title" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({
				redirect: {
					destination: "/indicators/ind1-test-title-1",
					permanent: true,
				},
			});
		});
		it("should return notFound if Id doesn't exist", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "nonExistingId99-test-title-1" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({ notFound: true });
		});

		it("should return notFound if an unhyphenated slug is used", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "slugwithouthyphenation" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({ notFound: true });
		});

		//TODO check logic for any missing cases
	});
});
