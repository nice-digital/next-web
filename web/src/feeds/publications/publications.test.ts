/**
 * @jest-environment node
 */
import MockAdapter from "axios-mock-adapter";

import { cache } from "@/cache";
import { serverRuntimeConfig } from "@/config";
import { client } from "@/feeds/index";
import areaOfInterestTypesMock from "@/mockData/publications/feeds/areaofinteresttypes.json";
import productsLiteMock from "@/mockData/publications/feeds/products-lite.json";
import productTypesMock from "@/mockData/publications/feeds/producttypes.json";

import {
	getAllAreasOfInterest,
	getAllProductTypes,
	getAllProducts,
} from "./publications";

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });
const cacheWrapMock = cache.wrap as jest.Mock;

describe("publications", () => {
	describe("getAllAreasOfInterest", () => {
		it("should return value from cache", async () => {
			const data = {};
			cacheWrapMock.mockResolvedValue(data);

			const retVal = await getAllAreasOfInterest();

			expect(cacheWrapMock).toHaveBeenCalledTimes(1);
			expect(retVal).toBe(data);
		});

		it("should use correct cache key and long TTL", async () => {
			await getAllAreasOfInterest();

			expect(cacheWrapMock).toHaveBeenCalledWith(
				"next-web:tests:publications:/feeds/areaofinteresttypes",
				expect.any(Function),
				{ ttl: serverRuntimeConfig.cache.longTTL }
			);
		});

		it("should load raw feed data with empty cache", async () => {
			axiosMock
				.onGet(/\/feeds\/areaofinteresttypes/)
				.reply(200, areaOfInterestTypesMock);
			await getAllAreasOfInterest();
			const data: Awaited<ReturnType<typeof getAllAreasOfInterest>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(2);
			expect(data[0]).toMatchSnapshot();
		});
	});

	describe("getAllProductTypes", () => {
		it("should return value from cache", async () => {
			const data = {};
			cacheWrapMock.mockResolvedValue(data);

			const retVal = await getAllProductTypes();

			expect(cacheWrapMock).toHaveBeenCalledTimes(1);
			expect(retVal).toBe(data);
		});

		it("should use correct cache key and long TTL", async () => {
			await getAllProductTypes();

			expect(cacheWrapMock).toHaveBeenCalledWith(
				"next-web:tests:publications:/feeds/producttypes",
				expect.any(Function),
				{ ttl: serverRuntimeConfig.cache.longTTL }
			);
		});

		it("should load raw feed data with empty cache", async () => {
			axiosMock.onGet(/\/feeds\/producttypes/).reply(200, productTypesMock);
			await getAllProductTypes();
			const data: Awaited<ReturnType<typeof getAllProductTypes>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(29);
			expect(data[0]).toMatchSnapshot();
		});
	});

	describe("getAllProducts", () => {
		it("should return value from cache", async () => {
			const data = {};
			cacheWrapMock.mockResolvedValue(data);

			const retVal = await getAllProducts();

			expect(cacheWrapMock).toHaveBeenCalledTimes(1);
			expect(retVal).toBe(data);
		});

		it("should use correct cache key and default TTL", async () => {
			await getAllProducts();

			expect(cacheWrapMock).toHaveBeenCalledWith(
				"next-web:tests:publications:/feeds/products-lite",
				expect.any(Function),
				{ ttl: serverRuntimeConfig.cache.defaultTTL }
			);
		});

		it("should load raw feed data with empty cache", async () => {
			axiosMock.onGet(/\/feeds\/products-lite/).reply(200, productsLiteMock);

			await getAllProducts();
			const data: Awaited<ReturnType<typeof getAllProducts>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(2963);
			expect(data[0]).toMatchSnapshot();
		});
	});
});
