import { PassThrough, Readable } from "stream";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ind999 from "@/mockData/publications/newfeeds/product/ind999.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { getServerSideProps } from "./index.page";

type FileDownloadGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	downloadPath: string;
}>;

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));
const axoisMock = new MockAdapter(axios, {
	onNoMatch: "throwException",
});

const loggerInfoMock = jest.mocked(logger.info);

const slug = "ind999-indicator-history-tab-html-conversion",
	resourceTitleId = "consultation-document",
	downloadPath = `IND999-${resourceTitleId}.docx`,
	productRoot = "indicators",
	resolvedUrl = `/${productRoot}/terminated/${slug}/history/downloads/${downloadPath}`,
	getServerSidePropsContext = {
		params: { slug, downloadPath },
		query: {
			productRoot,
		},
		resolvedUrl,
	} as unknown as FileDownloadGetServerSidePropsContext,
	resourceFileHref = "/guidance/IND999/documents/consultation-document";

describe("/indicators/terminated/[slug]/history/downloads/[downloadPath]", () => {
	beforeEach(() => {
		// Override ind999 to have Terminated status so the /terminated/ URL path matches
		axiosJSONMock.reset();
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail + "IND999", "i")).reply(200, {
			...ind999,
			ProductStatus: "Terminated",
		});
		addDefaultJSONFeedMocks();
	});

	describe("getServerSideProps", () => {
		it("should return not found if project does not exist", async () => {
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug: "pmg20",
					downloadPath: `PMG20-${resourceTitleId}.doc`,
				},
				query: {
					productRoot: "process",
				},
				resolvedUrl: `/process/pmg20/history/downloads/${downloadPath}`,
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Project could not be found for product PMG20`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if download path is not in expected format", async () => {
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug, downloadPath: "INCORRECTPATH" },
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Download path of INCORRECTPATH in product IND999 doesn't match expected format of [productId]-[resourceTitleId].[extension]`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if download path product id does not match resource product id", async () => {
			const incorrectProductId = "WRONGID100";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `${incorrectProductId}-${resourceTitleId}.docx`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Resource with ID ${resourceTitleId} belongs to product IND999 but URL was for product WRONGID100`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if resource id is not in product", async () => {
			const incorrectResourceId = "does-not-exist";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `IND999-${incorrectResourceId}.doc`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Could not find resource with ID ${incorrectResourceId} in product IND999`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if extension in download path does not match resource filename extension", async () => {
			const incorrectExtension = "WRONG";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `IND999-${resourceTitleId}.${incorrectExtension}`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Found incorrect extension of ${incorrectExtension} in resource ${resourceTitleId} in product IND999. Expected extension of docx`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});

	it("should return filestream when ids, title and extension all match", async () => {
		class ResponseStream extends PassThrough {
			setHeader(_key: string, _value: string) {
				return this;
			}
		}

		const mockFileStream = Readable.from("Some mock file content"),
			res = new ResponseStream(),
			setHeader = jest.spyOn(res, "setHeader"),
			responsePromise = new Promise<string>((resolve, reject) => {
				const chunks: Buffer[] = [];
				res
					.on("data", function (chunk) {
						chunks.push(Buffer.from(chunk));
					})
					.on("end", () => {
						const responseBody = Buffer.concat(chunks).toString("utf-8");

						resolve(responseBody);
					})
					.on("error", reject);
			});

		axoisMock
			.onGet(new RegExp(resourceFileHref))
			.reply(() => [200, mockFileStream]);

		await getServerSideProps({
			...getServerSidePropsContext,
			res: res as unknown as GetServerSidePropsContext["res"],
		});

		await expect(responsePromise).resolves.toBe("Some mock file content");
		expect(setHeader).toHaveBeenCalledWith(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		);
	});
});
