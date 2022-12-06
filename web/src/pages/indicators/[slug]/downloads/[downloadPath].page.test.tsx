import { PassThrough, Readable } from "stream";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { getServerSideProps, type Params } from "./[downloadPath].page";

const axoisMock = new MockAdapter(axios, {
	onNoMatch: "throwException",
});

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

const resourceUID = 3784329,
	partUID = 4904490349,
	downloadPath = `NG100-resource-impact-statement-${resourceUID}-${partUID}.pdf`,
	slug = `ng100`,
	resourcePDFHref = "/feeds/downloads/2d345860-3c0e-45f5-ac29-1acd6771a2fc";

const getServerSidePropsContext = {
	params: {
		slug,
		downloadPath,
	},
	query: {
		productRoot: "guidance",
	},
	resolvedUrl: `/guidance/${slug}/resources/downloads/${downloadPath}`,
} as unknown as GetServerSidePropsContext<Params>;

describe("getServerSideProps", () => {
	it("should return 404 not found when product is not found", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug: "abc123", downloadPath },
			})
		).toStrictEqual({ notFound: true });
	});

	it("should return 404 not found when product has no tools and resources", async () => {
		axiosJSONMock.reset();
		axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
			...ng100,
			_embedded: {
				// no related resources
			},
		});
		addDefaultJSONFeedMocks();

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
			`Download path of INCORRECT in product NG100 doesn't match expected format`
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
			"Found incorrect extension of xls in part Resource impact statement (4904490349) in product NG100. Expected extension of pdf"
		);
	});

	it("should return redierct to correct slugified title when incorrect", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: downloadPath.replace(
						"resource-impact-statement",
						"incorrect-part-title"
					),
				},
			})
		).toStrictEqual({
			redirect: {
				destination:
					"/guidance/ng100/resources/downloads/NG100-resource-impact-statement-3784329-4904490349.pdf",
				permanent: true,
			},
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Redirecting from title slug of incorrect-part-title to resource-impact-statement"
		);
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
