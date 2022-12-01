import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { FeedPath as InDevFeedPath } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import mockProject from "@/mockData/inDev/feeds/projects/ProjectDetail.json";
import mockProduct from "@/mockData/publications/feeds/products/ng100.json";
import mockProductTypes from "@/mockData/publications/feeds/producttypes.json";
import mockEditableContentResource from "@/mockData/publications/feeds/resource/29409.json";
import mockEditableHTML from "@/mockData/publications/feeds/supportingresource/29409/content/1/html.json";
import { ResourceTypeSlug } from "@/utils/resource";

import { getGetServerSidePropsFunc } from "./ProductResourcePage.getServerSideProps";

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
	slug = `${mockProduct.Id.toLowerCase()}`,
	resourceHref = `/feeds/resource/29409`,
	partHTMLHref = "/feeds/supportingresource/29409/content/1/html",
	productRoot = "guidance",
	getServerSidePropsContext = {
		params: {
			slug,
			partSlug,
		},
		query: {
			productRoot,
		},
		resolvedUrl: `/${productRoot}/${slug}/resources/${partSlug}`,
	} as unknown as GetServerSidePropsContext<Params>;

describe("getServerSideProps", () => {
	const getServerSideProps = getGetServerSidePropsFunc(
		ResourceTypeSlug.ToolsAndResources
	);

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
			.onGet(new RegExp(partHTMLHref))
			.reply(200, mockEditableHTML)
			.onGet(new RegExp(InDevFeedPath.ProjectDetail))
			.reply(200, mockProject);

		jest.resetModules();
	});

	it("should return not found when product has no resources", async () => {
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
			...mockProduct,
			_embedded: {
				// no related resources
			},
		});

		expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual({
			notFound: true,
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			`Could not find resource with UID ${resourceUID} in product ${mockProduct.Id}`
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
			`Resource part slug of incorrect in product NG100 doesn't match expected format`
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
			`Could not find resource with UID 123 in product NG100`
		);
	});

	it("should return not found when full resource returns 404", async () => {
		axiosJSONMock.onGet(new RegExp(resourceHref)).reply(404, {
			Message: "Not found",
			StatusCode: "NotFound",
		});

		expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual({
			notFound: true,
		});

		expect(loggerWarnMock.mock.calls[0][0]).toBe(
			`Full resource with id 3784329 in product NG100 can't be found`
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
						"/guidance/ng100/resources/resource-impact-statement-3784329-4904490349",
					permanent: true,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				"Redirecting from title slug of incorrect-part-title to resource-impact-statement"
			);
		});

		it("should throw when editable content HTML not found", async () => {
			axiosJSONMock.onGet(new RegExp(partHTMLHref)).reply(404, {
				Message: "Not found",
				StatusCode: "NotFound",
			});

			expect(getServerSideProps(getServerSidePropsContext)).rejects.toBe(
				`Could not find editable part HTML for part ${partUID} in product ${mockProduct.Id}`
			);
		});

		it("should return props when resource and part HTML exist", async () => {
			expect(await getServerSideProps(getServerSidePropsContext))
				.toMatchInlineSnapshot(`
			Object {
			  "props": Object {
			    "chapterSections": Array [],
			    "chapters": Array [],
			    "hasEvidenceResources": true,
			    "hasHistory": true,
			    "hasInfoForPublicResources": true,
			    "hasToolsAndResources": true,
			    "htmlBody": "<p>Some body content</p>",
			    "lastUpdated": "2018-07-11T00:05:07.4294909",
			    "product": Object {
			      "id": "NG100",
			      "lastMajorModificationDate": "2020-10-12T00:00:00",
			      "productTypeName": "NICE guideline",
			      "publishedDate": "2018-07-11T00:00:00",
			      "title": "Rheumatoid arthritis in adults: management",
			    },
			    "productPath": "/guidance/ng100",
			    "resourceDownloadPath": "/guidance/ng100/downloads/NG100-resource-impact-statement-3784329-4904490349.pdf",
			    "resourceDownloadSizeBytes": 40258,
			    "resourceTypeSlug": "resources",
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
