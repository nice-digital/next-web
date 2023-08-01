import { type GetServerSidePropsContext } from "next";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { getServerSideProps } from ".";

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
	slug = `ng100`,
	resourceHref = "/feeds/resource/29409",
	partHTMLHref = "/feeds/supportingresource/29409/content/1/html",
	productRoot = "guidance",
	resolvedUrl = `/${productRoot}/${slug}/resources/${partSlug}`;

const getServerSidePropsContext = {
	params: {
		slug,
		partSlug,
	},
	query: {
		productRoot,
	},
	resolvedUrl,
} as unknown as GetServerSidePropsContext<Params>;

describe("/indicators/resources/[partSlug]", () => {
	describe("getServerSideProps", () => {
		it("should return not found when product has no resources", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ng100,
				_embedded: {
					// no related resources
				},
			});
			addDefaultJSONFeedMocks();

			expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual(
				{
					notFound: true,
				}
			);

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Could not find resource with UID ${resourceUID} in product NG100`
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
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(resourceHref)).reply(404, {
				Message: "Not found",
				StatusCode: "NotFound",
			});
			addDefaultJSONFeedMocks();

			expect(await getServerSideProps(getServerSidePropsContext)).toStrictEqual(
				{
					notFound: true,
				}
			);

			expect(loggerWarnMock.mock.calls[0][0]).toBe(
				`Full resource with id ${resourceUID} in product NG100 can't be found`
			);
		});

		describe("editable content part", () => {
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
						resolvedUrl: resolvedUrl.replace(
							"resource-impact-statement",
							"incorrect-part-title"
						),
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

			it("should throw error when editable content HTML not found", async () => {
				axiosJSONMock.reset();
				axiosJSONMock.onGet(new RegExp(partHTMLHref)).reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});
				addDefaultJSONFeedMocks();

				await expect(
					getServerSideProps(getServerSidePropsContext)
				).rejects.toStrictEqual(
					Error(
						`Could not find editable part HTML for part ${partUID} in product NG100`
					)
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
});
