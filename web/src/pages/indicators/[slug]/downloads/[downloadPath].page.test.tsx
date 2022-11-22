import { PassThrough } from "stream";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import mockProductRaw from "@/mockData/publications/feeds/products/indicator.json";
import mockProductTypes from "@/mockData/publications/feeds/producttypes.json";
import mockEditableContentResource from "@/mockData/publications/feeds/resource/29409.json";

import { getServerSideProps, type Params } from "./[downloadPath].page";

const axiosJSONMock = new MockAdapter(client, {
		onNoMatch: "throwException",
	}),
	axoisMock = new MockAdapter(axios, {
		onNoMatch: "throwException",
	});

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

const resourceUID = 3784329,
	partUID = 4904490349,
	downloadPath = `${mockProductRaw.Id}-incorrect-part-title-${resourceUID}-${partUID}.pdf`,
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
		downloadPath,
	},
	query: {
		productRoot: "indicators",
	},
	resolvedUrl: `/indicators/${slug}/resources/downloads/${downloadPath}`,
} as unknown as GetServerSidePropsContext<Params>;

describe("getServerSideProps", () => {
	beforeEach(() => {
		axiosJSONMock.reset();

		axiosJSONMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProduct)
			.onGet(new RegExp(resourceHref))
			.reply(200, mockEditableContentResource)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes);

		// TOD: reply with a mock stream
		axoisMock
			.onGet(
				new RegExp(
					mockEditableContentResource._embedded[
						"nice.publications:content-part-list"
					]._embedded["nice.publications:editable-content-part"]._embedded[
						"nice.publications:pdf-file"
					]._links.self[0].href
				)
			)
			.reply(200, new PassThrough());

		jest.resetModules();
	});

	it("should return 404 not found when product is not found", async () => {
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(404, {
			Message: "Not found",
			StatusCode: "NotFound",
		});

		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug: "NOTFOUND", downloadPath },
			})
		).toStrictEqual({ notFound: true });
	});

	it("should return 404 not found when product has no tools and resources", async () => {
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
			...mockProduct,
			_embedded: {
				// no related resources
			},
		});

		expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual({
			notFound: true,
		});
	});

	it("should return 404 when download path is incorrect format", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug, downloadPath: "INCORRECT" },
			})
		).toStrictEqual({
			notFound: true,
		});

		expect(loggerInfoMock).toHaveBeenCalledWith(
			`Download path of INCORRECT in product IND1001 doesn't match expected format`
		);
	});

	it("should return 404 when file extension in URL doesn't match content part's file extension", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug, downloadPath: downloadPath.replace(".pdf", ".xls") },
			})
		).toStrictEqual({
			notFound: true,
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Found incorrect extension of xls in part Resource impact statement (4904490349) in product IND1001. Expected extension of pdf"
		);
	});

	it("should return redierct to correct slugified title when incorrect", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath,
				},
			})
		).toStrictEqual({
			redirect: {
				destination:
					"/indicators/ind1001-product-title/resources/downloads/IND1001-resource-impact-statement-3784329-4904490349.pdf",
				permanent: true,
			},
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Redirecting from title slug of incorrect-part-title to resource-impact-statement"
		);
	});

	it.todo("should return filestream when uids, title and extension all match");
});
