import {
	render,
	screen,
	waitFor,
	getDefaultNormalizer,
} from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { useRouter } from "next/router";

import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";
import productTypesMock from "@/mockData/publications/feeds/producttypes.json";

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
			id: "ind1",
		})),
	};
});

function getMetaByName(metaName: string) {
	// eslint-disable-next-line testing-library/no-node-access
	const metas = document.getElementsByTagName("meta");
	for (let i = 0; i < metas.length; i += 1) {
		if (metas[i].getAttribute("name") === metaName) {
			return metas[i].getAttribute("content");
		}
	}
	return "";
}

const mockProduct: IndicatorsDetailsPageProps["product"] = {
	title: "test title",
	shortTitle: null,
	id: "IND1",
	lastModified: "2022-10-12T07:57:45.0879965Z",
	productType: "IND",
	publishedDate: "2022-09-08T14:19:12.8893126",
	lastMajorModificationDate: "2022-10-08T14:19:12.8893126",
	metaDescription: "This is the test meta description",
	embedded: {} as unknown as IndicatorsDetailsPageProps["product"]["embedded"],
	chapterHeadings: [],
	summary: "",
};

const props: IndicatorsDetailsPageProps = {
	slug: "/ind-1-test-title-1",
	id: "IND1",
	product: mockProduct,
	productType: {
		_links: {
			self: [{}],
		},
		eTag: null,
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
		(useRouter as jest.Mock).mockImplementation(() => ({}));
		axiosMock.reset();
		jest.resetModules();
	});

	it("should match snapshot for main content", () => {
		render(<IndicatorsDetailsPage {...props} />);
		expect(document.body).toMatchSnapshot();
	});

	it("should render the page title with reversed breadcrumbs for SEO", async () => {
		render(<IndicatorsDetailsPage {...props} />);
		await waitFor(() => {
			expect(document.title).toEqual(
				"test title | Indicators | Standards and Indicators | NICE"
			);
		});
	});

	it("should render the correct page meta tags for robots", async () => {
		render(<IndicatorsDetailsPage {...props} />);

		await waitFor(() =>
			expect(getMetaByName("robots")).toEqual("index,follow")
		);
	});

	it("should render the correct page meta tags for description", async () => {
		render(<IndicatorsDetailsPage {...props} />);

		await waitFor(() =>
			expect(getMetaByName("description")).toEqual(
				"This is the test meta description"
			)
		);
	});

	describe("PageHeader", () => {
		it("should render meta data id in uppercase", () => {
			render(<IndicatorsDetailsPage {...props} />);
			expect(
				screen.getByText("IND1", { selector: ".page-header__metadata li" })
			).toBeInTheDocument();
		});

		it.each([
			["NICE indicator"],
			["IND1"],
			["Published: 8 September 2022"],
			["Last updated: 12 October 2022"],
		])("should render a %s page header meta element", (metaContent) => {
			render(<IndicatorsDetailsPage {...props} />);

			expect(
				screen.getByText(
					(content, element) => {
						return (
							getDefaultNormalizer()(element?.textContent as string) ==
							metaContent
						);
					},
					{
						selector: ".page-header__metadata li",
					}
				)
			);
		});

		it("should not render last updated date if published date == lastModified date", () => {
			render(
				<IndicatorsDetailsPage
					{...props}
					product={{
						...mockProduct,
						lastMajorModificationDate: mockProduct.publishedDate,
					}}
				/>
			);

			expect(screen.queryByText("Last updated:")).not.toBeInTheDocument();
		});

		it("should render last updated date if published date !== lastModified date", () => {
			render(<IndicatorsDetailsPage {...props} />);

			expect(screen.getByText("Last updated:")).toBeInTheDocument();
		});

		it("should render 'Published' date page header lead meta element in the correct format", () => {
			render(<IndicatorsDetailsPage {...props} />);
			const publishedDateEl = screen.getByText("8 September 2022", {
				selector: "time",
			});
			expect(publishedDateEl).toBeInTheDocument();
		});

		it("should render 'Published' date page header lead meta element with correctly formatted datetime attribute", () => {
			render(<IndicatorsDetailsPage {...props} />);
			const publishedDateEl = screen.getByText("8 September 2022", {
				selector: "time",
			});
			expect(publishedDateEl).toHaveAttribute("datetime", "2022-09-08");
		});

		it("should render 'Last updated' date page header lead meta element in the correct format", () => {
			render(<IndicatorsDetailsPage {...props} />);
			const publishedDateEl = screen.getByText("12 October 2022", {
				selector: "time",
			});
			expect(publishedDateEl).toBeInTheDocument();
		});

		it("should render 'Last updated' date page header lead meta element with correctly formatted datetime attribute", () => {
			render(<IndicatorsDetailsPage {...props} />);
			const publishedDateEl = screen.getByText("12 October 2022", {
				selector: "time",
			});
			expect(publishedDateEl).toHaveAttribute("datetime", "2022-10-12");
		});
	});

	describe("Chapter menu", () => {
		it.todo("should render overview chapter link when summary provided");
		it.todo("should render correct chapter url based on producttype and slug");
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
				product: { id: "ind1", title: "Test title 1" },
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
