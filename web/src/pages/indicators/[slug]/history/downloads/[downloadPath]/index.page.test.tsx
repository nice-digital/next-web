import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";

import { FeedPath as IndevFeedPath } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import { logger } from "@/logger";
import mockProject from "@/mockData/inDev/feeds/projects/ProjectDetail.json";
import mockProductWithInDevReference from "@/mockData/publications/feeds/products/indicator-with-indev-reference.json";

import { getServerSideProps } from "./index.page";

type FileDownloadnGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	downloadPath: string;
}>;

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

jest.mock("@/logger", () => ({
	logger: { info: jest.fn() },
}));

const loggerInfoMock = jest.mocked(logger.info);

describe("/indicators/[slug]/history/downloads/[downloadPath]", () => {
	const slug = "ind6-new-indicator-product-1";
	const resourceTitleId = "comments-form";

	const downloadPath = `IND6-${resourceTitleId}.doc`;

	const resolvedUrl = `/indicators/${slug}/history/downloads/${downloadPath}`;
	const context = {
		params: { slug, downloadPath },
		resolvedUrl: resolvedUrl,
	} as FileDownloadnGetServerSidePropsContext;

	beforeEach(() => {
		axiosMock.reset();

		axiosMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProductWithInDevReference)
			.onGet(new RegExp(IndevFeedPath.ProjectDetail))
			.reply(200, mockProject);

		jest.resetModules();
	});

	describe("getServerSideProps", () => {
		it("should return not found if project does not exist", async () => {
			axiosMock.onGet(new RegExp(IndevFeedPath.ProjectDetail)).reply(404, "");
			const notFoundResult = await getServerSideProps(context);

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Project could not be found for product ${mockProductWithInDevReference.Id}`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if download path is not in expected format", async () => {
			const notFoundResult = await getServerSideProps({
				...context,
				params: { slug, downloadPath: "INCORRECTPATH" },
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Download path of INCORRECTPATH in product ${mockProductWithInDevReference.Id} doesn't match expected format of [productId]-[resourceTitleId].[extension]`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if download path product id does not match resource product id", async () => {
			const incorrectProductId = "WRONGID100";
			const notFoundResult = await getServerSideProps({
				...context,
				params: {
					slug,
					downloadPath: `${incorrectProductId}-${resourceTitleId}.doc`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Resource with ID ${resourceTitleId} belongs to product ${mockProductWithInDevReference.Id} but URL was for product WRONGID100`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if resource id is not in product", async () => {
			const incorrectResourceId = "comments-form-does-not-exist";
			const notFoundResult = await getServerSideProps({
				...context,
				params: {
					slug,
					downloadPath: `${mockProductWithInDevReference.Id}-${incorrectResourceId}.doc`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Could not find resource with ID ${incorrectResourceId} in product ${mockProductWithInDevReference.Id}`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});

		it("should return not found if extension in download path does not match resource filename extension", async () => {
			const incorrectExtension = "WRONG";
			const notFoundResult = await getServerSideProps({
				...context,
				params: {
					slug,
					downloadPath: `${mockProductWithInDevReference.Id}-${resourceTitleId}.${incorrectExtension}`,
				},
			});

			expect(loggerInfoMock.mock.calls[0][0]).toBe(
				`Found incorrect extension of WRONG in resource comments-form in product IND6. Expected extension of doc`
			);
			expect(notFoundResult).toStrictEqual({ notFound: true });
		});
	});
});
