import { storyblokInit } from "@storyblok/react";
import { waitFor } from "@testing-library/react";

import { logger } from "@/logger";

import { initStoryblok } from "./initStoryblok";

// jest.mock("@/config", () => ({
// 	publicRuntimeConfig: {
// 		storyblok: {
// 			ocelotEndpoint: "testEndpoint",
// 			accessToken: "testApiKey",
// 		},
// 	},
// }));

describe("initStoryblok", () => {
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
		process.env.PUBLIC_STORYBLOK_ACCESS_TOKEN = "testApiKey";
		process.env.PUBLIC_STORYBLOK_OCELOT_ENDPOINT = "testEndpoint";
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		delete process.env.PUBLIC_STORYBLOK_ACCESS_TOKEN;
		delete process.env.PUBLIC_STORYBLOK_OCELOT_ENDPOINT;
	});

	it("should initialize Storyblok with the storyblokApiKey", () => {
		initStoryblok();

		expect(storyblokInit).toHaveBeenCalledWith({
			accessToken: "testApiKey",
			use: [{}],
			apiOptions: {
				cache: {
					clear: "manual",
					type: "none",
				},
				endpoint: "testEndpoint",
			},
		});

		expect(jest.isMockFunction(logger.info)).toBe(true);

		expect(logger.info).toHaveBeenCalledWith("end initStoryblok");
	});

	it("should log an error when an exception is thrown", async () => {
		/*
		   We've wrapped the storyblokInit call in a try/catch block.
		   To date storyblokInit returns void and doesn't throw errors.
		*/
		(storyblokInit as jest.Mock).mockImplementationOnce(() => {
			throw new Error("Test error");
		});

		initStoryblok();

		expect(jest.isMockFunction(logger.info)).toBe(true);
		expect(jest.isMockFunction(logger.error)).toBe(true);

		expect(logger.info).toHaveBeenCalled();
		await waitFor(() => {
			expect(logger.error).toHaveBeenCalledWith(
				{
					ocelotEndpoint: "testEndpoint",
					usingOcelotCache: true,
					error: new Error("Test error"),
				},
				"Error initialising Storyblok: Error: Test error"
			);
		});
	});
});
