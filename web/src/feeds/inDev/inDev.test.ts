/**
 * @jest-environment node
 */
import MockAdapter from "axios-mock-adapter";

import { cache } from "@/cache";
import { serverRuntimeConfig } from "@/config";
import allProjectsMock from "@/mockData/inDev/gidprojects/all.json";
import consultationsMock from "@/mockData/inDev/inconsultationprojects.json";

import { client } from "../../feeds";

import { getAllProjects, getAllConsultations, FeedPath } from "./inDev";

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });
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
			axiosMock
				.onGet(new RegExp(FeedPath.AllProjects))
				.reply(200, allProjectsMock);
			await getAllProjects();
			const data: Awaited<ReturnType<typeof getAllProjects>> =
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
			axiosMock
				.onGet(new RegExp(FeedPath.InConsultationProjects))
				.reply(200, consultationsMock);
			await getAllConsultations();
			const data: Awaited<ReturnType<typeof getAllConsultations>> =
				await cacheWrapMock.mock.calls[0][1]();

			expect(data).toHaveLength(20);
			expect(data[0]).toMatchSnapshot();
		});
	});
});
