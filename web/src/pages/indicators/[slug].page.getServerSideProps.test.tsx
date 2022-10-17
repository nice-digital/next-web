import { render } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";

import productTypesMock from "../../__mocks__/__data__/publications/feeds/producttypes.json";
import { client } from "../../feeds/";

import IndicatorsDetailsPage, {
	getServerSideProps,
	IndicatorsDetailsPageProps,
} from "./[slug].page";

import type { GetServerSidePropsContext } from "next";

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });

jest.mock("@/feeds/publications/publications", () => {
	const originalModule = jest.requireActual(
		"@/feeds/publications/publications"
	);

	//Mock the getProductDetail export
	return {
		__esModule: true,
		...originalModule,
		getProductDetail: jest.fn(() => ({
			title: "Test title 1",
			id: "IND1",
		})),
	};
});

const props: IndicatorsDetailsPageProps = {
	slug: "/ind-1-test-title-1",
	id: "IND1",
	product: { title: "/test", id: "IND1", productType: "IND" },
	productType: {
		_links: {
			self: [{}],
		},
		eTag: null,
		lastModified: "2022-07-07T00:00:00",
		enabled: true,
		name: "NICE indicator",
		pluralName: "NICE indicators",
		identifierPrefix: ProductTypeAcronym.IND,
		group: ProductGroup.Other,
		parent: "",
	},
} as unknown as IndicatorsDetailsPageProps;

describe("IndicatorDetailPage", () => {
	beforeEach(() => {
		axiosMock.reset();
		jest.resetModules();
	});

	it("should match snapshot for main content", () => {
		render(<IndicatorsDetailsPage {...props} />);

		expect(document.body).toMatchSnapshot();
	});
});

describe("getGetServerSidePropsFunc", () => {
	it("should return a correct props when supplied with an id", async () => {
		const fakeProductResponseData = {
			title: "test-title",
			id: "IND1",
			productType: "IND",
		};

		axiosMock
			.onGet(/\/feeds\/product\//)
			.reply(200, fakeProductResponseData)
			.onGet(/\/feeds\/producttypes/)
			.reply(200, productTypesMock);

		const result = await getServerSideProps({
			params: { slug: "ind1-test-title-1" },
		} as unknown as GetServerSidePropsContext);

		expect(result).toStrictEqual({
			props: {
				slug: "ind1-test-title-1",
				id: "ind1",
				product: { id: "IND1", title: "Test title 1" },
				productType: {
					eTag: null,
					enabled: true,
					group: "Other",
					identifierPrefix: "IND",
					lastModified: "2022-07-07T00:00:00",
					links: {
						self: [{}],
					},
					name: "NICE indicator",
					parent: "",
					pluralName: "NICE indicators",
				},
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
