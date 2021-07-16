/**
 * @jest-environment node
 */
import type { PromiseValue } from "type-fest";

import { getAllProjects, getAllConsultations } from "./inDev";

import { cache } from "@/cache";
import { serverRuntimeConfig } from "@/config";

const cacheWrapMock = cache.wrap as jest.Mock;

describe("feeds/inDev", () => {
	describe("getAllProjects", () => {
		it("should return value from cache", async () => {
			const data = {};
			cacheWrapMock.mockResolvedValue(data);

			const retVal = await getAllProjects();

			expect(cacheWrapMock).toHaveBeenCalledTimes(1);
			expect(retVal).toBe(data);
		});

		it("should use correct cache key and default TTL", async () => {
			await getAllProjects();

			expect(cacheWrapMock).toHaveBeenCalledWith(
				"next-web:tests:inDev:/gidprojects/all",
				expect.any(Function),
				{ ttl: serverRuntimeConfig.cache.defaultTTL }
			);
		});

		it("should load raw feed data with empty cache", async () => {
			await getAllProjects();
			const data: PromiseValue<ReturnType<typeof getAllProjects>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(887);
			expect(data[0]).toMatchSnapshot();
		});
	});

	describe("getAllConsultations", () => {
		it("should return value from cache", async () => {
			const data = {};
			cacheWrapMock.mockResolvedValue(data);

			const retVal = await getAllConsultations();

			expect(cacheWrapMock).toHaveBeenCalledTimes(1);
			expect(retVal).toBe(data);
		});

		it("should use correct cache key and default TTL", async () => {
			await getAllConsultations();

			expect(cacheWrapMock).toHaveBeenCalledWith(
				"next-web:tests:inDev:/inconsultationprojects",
				expect.any(Function),
				{ ttl: serverRuntimeConfig.cache.defaultTTL }
			);
		});

		it("should load raw feed data with empty cache", async () => {
			await getAllConsultations();
			const data: PromiseValue<ReturnType<typeof getAllConsultations>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(20);
			expect(data[0]).toMatchSnapshot();
		});
	});
});
