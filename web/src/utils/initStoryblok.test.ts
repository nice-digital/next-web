import { storyblokInit } from "@storyblok/react";
import { waitFor } from "@testing-library/react";

import { logger } from "@/logger";

import { initStoryblok } from "./initStoryblok";

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		storyblok: {
			ocelotEndpointV2: "testEndpoint",
			accessToken: "testApiKey",
		},
	},
}));

describe("initStoryblok", () => {
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
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
					ocelotEndpointV2: "testEndpoint",
					usingOcelotCache: true,
					error: new Error("Test error"),
				},
				"Error initialising Storyblok: Error: Test error"
			);
		});
	});
});
