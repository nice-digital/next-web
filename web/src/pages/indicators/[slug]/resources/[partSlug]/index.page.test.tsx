import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import mockProductRaw from "@/mockData/publications/feeds/products/indicator.json";
import mockProductTypes from "@/mockData/publications/feeds/producttypes.json";
import mockEditableContentResource from "@/mockData/publications/feeds/resource/29409.json";
import mockEditableHTML from "@/mockData/publications/feeds/supportingresource/29409/content/1/html.json";

import { getServerSideProps } from "./index.page";

const axiosJSONMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

jest.mock("@/logger", () => ({
	logger: { info: jest.fn(), warn: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info),
	loggerWarnMock = jest.mocked(logger.warn);

export type Params = {
	slug: string;
	partSlug: string;
};

const resourceUID = 3784329,
	partUID = 4904490349,
	partSlug = `resource-impact-statement-${resourceUID}-${partUID}`,
	title = "Product title",
	slug = `${mockProductRaw.Id.toLowerCase()}-product-title`,
	resourceHref = "/feeds/resource/1234";

const mockProduct: typeof mockProductRaw = {
	...mockProductRaw,
	Title: title,
	_embedded: {
		...mockProductRaw._embedded,
		"nice.publications:related-resource-list": {
			_links: { self: [{}] },
			ETag: null,
			_embedded: {
				"nice.publications:related-resource": {
					_links: {
						self: [{}],
						"nice.publications:related-resource-uri": [
							{
								href: resourceHref,
							},
						],
					},
					ETag: null,
					Status: "Published",
					Language: "English",
					ResourceType: "AnythingThatIsntEvidence",
					Title: "Resource title",
					Uid: resourceUID,
					_embedded: {
						"nice.publications:resource-group-list": {
							_links: { self: [{}] },
							ETag: null,
							_embedded: {
								"nice.publications:resource-group": {
									_links: { self: [{}] },
									ETag: null,
									Name: "Anything",
								},
							},
						},
					},
				},
			},
		},
	},
};

const getServerSidePropsContext = {
	params: {
		slug,
		partSlug,
	},
	query: {
		productRoot: "indicators",
	},
	resolvedUrl: `/indicators/${slug}/resources/${partSlug}`,
} as unknown as GetServerSidePropsContext<Params>;

describe("/indicators/resources/[partSlug]", () => {
	beforeEach(() => {
		axiosJSONMock.reset();

		axiosJSONMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProduct)
			.onGet(new RegExp(resourceHref))
			.reply(200, mockEditableContentResource)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes)
			.onGet(
				new RegExp(
					mockEditableContentResource._embedded[
						"nice.publications:content-part-list"
					]._embedded["nice.publications:editable-content-part"]._embedded[
						"nice.publications:html-content"
					]._links.self[0].href
				)
			)
			.reply(200, mockEditableHTML);

		jest.resetModules();
	});

	describe("getServerSideProps", () => {
		it("should return not found when product has no resources", async () => {
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...mockProduct,
				_embedded: {
					// no related resources
				},
			});

			expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual(
				{
					notFound: true,
				}
			);

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Can't serve resource with url /indicators/ind1001-product-title/resources/resource-impact-statement-3784329-4904490349 in product IND1001: no tools and resources`
			);
		});

		it("should return not found when part slug is in the correct format", async () => {
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: { slug, partSlug: "incorrect" },
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Resource part slug of incorrect in product IND1001 doesn't match expected format`
			);
		});

		it("should return not found when resource doesn't exist on product", async () => {
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: { slug, partSlug: "doesnt-exist-123-456" },
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Could not find resource with UID 123 in product IND1001`
			);
		});

		it("should return not found when full resource returns 404", async () => {
			axiosJSONMock.onGet(new RegExp(resourceHref)).reply(404, {
				Message: "Not found",
				StatusCode: "NotFound",
			});

			expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual(
				{
					notFound: true,
				}
			);

			expect(loggerWarnMock.mock.calls[0][0]).toBe(
				`Full resource with id 3784329 in product IND1001 can't be found`
			);
		});

		describe("editable content part", () => {
			beforeEach(() => {
				axiosJSONMock
					.onGet(new RegExp(resourceHref))
					.reply(200, mockEditableContentResource);
			});

			it("should redirect to correct title slug from incorrect title slug", async () => {
				expect(
					await getServerSideProps({
						...getServerSidePropsContext,
						params: {
							slug,
							partSlug: partSlug.replace(
								"resource-impact-statement",
								"incorrect-part-title"
							),
						},
					})
				).toStrictEqual({
					redirect: {
						destination:
							"/indicators/ind1001-product-title/resources/resource-impact-statement-3784329-4904490349",
						permanent: true,
					},
				});

				expect(loggerInfoMock.mock.calls[0][0]).toBe(
					"Redirecting from title slug of incorrect-part-title to resource-impact-statement"
				);
			});

			it("should return not found when editable content HTML not found", async () => {
				axiosJSONMock
					.onGet(
						new RegExp(
							mockEditableContentResource._embedded[
								"nice.publications:content-part-list"
							]._embedded["nice.publications:editable-content-part"]._embedded[
								"nice.publications:html-content"
							]._links.self[0].href
						)
					)
					.reply(404, {
						Message: "Not found",
						StatusCode: "NotFound",
					});

				expect(
					await getServerSideProps(getServerSidePropsContext)
				).toStrictEqual({
					notFound: true,
				});

				expect(loggerWarnMock.mock.calls[0][0]).toBe(
					`Could not find editable part HTML for part ${partUID} in product IND1001`
				);
			});

			it("should return props when resource and part HTML exist", async () => {
				expect(await getServerSideProps(getServerSidePropsContext))
					.toMatchInlineSnapshot(`
			Object {
			  "props": Object {
			    "chapters": Array [],
			    "hasEvidenceResources": false,
			    "hasHistory": false,
			    "hasInfoForPublicResources": false,
			    "hasToolsAndResources": true,
			    "htmlBody": "<p>Some body content</p>",
			    "lastUpdated": "2018-07-11T00:05:07.4294909",
			    "product": Object {
			      "id": "IND1001",
			      "lastMajorModificationDate": "2022-09-08T14:19:12.8893126",
			      "productTypeName": "NICE indicator",
			      "publishedDate": "2022-09-08T14:19:12.8893126",
			      "title": "Product title",
			    },
			    "productPath": "/indicators/ind1001-product-title",
			    "title": "Resource impact statement",
			  },
			}
		`);
			});
		});

		describe("upload and convert content part", () => {
			// TODO
		});
	});
});
