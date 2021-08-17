/**
 * @jest-environment node
 */
import { cache } from "@/cache";
import { serverRuntimeConfig } from "@/config";

import {
	getAllAreasOfInterest,
	getAllProductTypes,
	getAllProducts,
} from "./publications";

import type { PromiseValue } from "type-fest";

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
			await getAllAreasOfInterest();
			const data: PromiseValue<ReturnType<typeof getAllAreasOfInterest>> =
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
			await getAllProductTypes();
			const data: PromiseValue<ReturnType<typeof getAllProductTypes>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(27);
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
			await getAllProducts();
			const data: PromiseValue<ReturnType<typeof getAllProducts>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(2717);
			expect(data[0]).toMatchSnapshot();
		});
	});
});
