import { PassThrough, Readable } from "stream";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { logger } from "@/logger";

import { getServerSideProps } from "./index.page";

type FileDownloadnGetServerSidePropsContext = GetServerSidePropsContext<{
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

const slug = "ng100",
	resourceTitleId = "equality-impact-assessment-5",
	downloadPath = `NG100-${resourceTitleId}.pdf`,
	productRoot = "guidance",
	resolvedUrl = `/${productRoot}/${slug}/history/downloads/${downloadPath}`,
	getServerSidePropsContext = {
		params: { slug, downloadPath },
		query: {
			productRoot,
		},
		resolvedUrl,
	} as unknown as FileDownloadnGetServerSidePropsContext,
	resourcePDFHref = "/guidance/NG100/documents/equality-impact-assessment-5";

describe("/indicators/[slug]/history/downloads/[downloadPath]", () => {
	describe("getServerSideProps", () => {
		it("should return not found if project does not exist", async () => {
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug: "pmg20", downloadPath: `PMG20-${resourceTitleId}.doc` },
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
				`Download path of INCORRECTPATH in product NG100 doesn't match expected format of [productId]-[resourceTitleId].[extension]`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if download path product id does not match resource product id", async () => {
			const incorrectProductId = "WRONGID100";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `${incorrectProductId}-${resourceTitleId}.doc`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Resource with ID ${resourceTitleId} belongs to product NG100 but URL was for product WRONGID100`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if resource id is not in product", async () => {
			const incorrectResourceId = "comments-form-does-not-exist";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `NG100-${incorrectResourceId}.doc`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Could not find resource with ID ${incorrectResourceId} in product NG100`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if extension in download path does not match resource filename extension", async () => {
			const incorrectExtension = "WRONG";
			const notFoundResult = await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: `NG100-${resourceTitleId}.${incorrectExtension}`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Found incorrect extension of WRONG in resource ${resourceTitleId} in product NG100. Expected extension of pdf`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});

	it("should return filestream when uids, title and extension all match", async () => {
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
			.onGet(new RegExp(resourcePDFHref))
			.reply(() => [200, mockFileStream]);

		await getServerSideProps({
			...getServerSidePropsContext,
			res: res as unknown as GetServerSidePropsContext["res"],
		});

		await expect(responsePromise).resolves.toBe("Some mock file content");
		expect(setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
	});
});
