import { PassThrough, Readable } from "stream";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import gid_dg10049 from "@/mockData/inDev/project/gid-dg10049.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import { getServerSideProps, type Params } from "./[downloadPath]";

const axoisMock = new MockAdapter(axios, {
	onNoMatch: "throwException",
});

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

const downloadPath = `GID-DG10049-final-scope.pdf`,
	slug = `gid-dg10049`,
	resourcePDFHref = "/guidance/GID-DG10049/documents/final-scope";

const productRoot = "guidance",
	statusSlug = "indevelopment",
	getServerSidePropsContext = {
		params: {
			slug,
			downloadPath,
		},
		query: {
			productRoot,
			statusSlug,
		},
		resolvedUrl: `/guidance/indevelopment/${slug}/downloads/${downloadPath}`,
	} as unknown as GetServerSidePropsContext<Params>;

describe("getServerSideProps", () => {
	it("should return 404 not found when project is not found", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: { slug: "gid-abc123", downloadPath },
				query: { productRoot, statusSlug },
			})
		).toStrictEqual({ notFound: true });
	});

	it("should return 404 not found when project has no panels", async () => {
		axiosJSONMock.reset();
		axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
			...gid_dg10049,
			_embedded: {
				// no panels
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
			`Download path of INCORRECT in project GID-DG10049 doesn't match expected format of [projectReference]-[resourceTitleId].[extension]`
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
			"Found incorrect extension of xls in resource 'final-scope' in project GID-DG10049. Expected extension of pdf"
		);
	});

	it("should return not found when download path has incorrect project GID prefix", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: "GID-INCORRECT123-final-scope.pdf",
				},
			})
		).toStrictEqual({
			notFound: true,
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Resource with ID 'final-scope' belongs to project GID-DG10049 but URL was for project GID-INCORRECT123"
		);
	});

	it("should return not found when resource doesn't exist within the project", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: downloadPath.replace("final-scope", "missing"),
				},
			})
		).toStrictEqual({
			notFound: true,
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Could not find resource with ID 'missing' in project GID-DG10049"
		);
	});

	it("should return not found for found resource that has no file download", async () => {
		expect(
			await getServerSideProps({
				...getServerSidePropsContext,
				params: {
					slug,
					downloadPath: downloadPath.replace(
						"final-scope.pdf",
						"html-content.html"
					),
				},
			})
		).toStrictEqual({
			redirect: {
				destination:
					"/guidance/indevelopment/gid-dg10049/documents/html-content",
				permanent: true,
			},
		});

		expect(loggerInfoMock.mock.calls[0][0]).toBe(
			"Redirecting HTML resource with id 'html-content' in project GID-DG10049"
		);
	});

	it("should return filestream when title and extension match in URL match found resource file", async () => {
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
