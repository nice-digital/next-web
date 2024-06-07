import { storyblokInit } from "@storyblok/react";
import { waitFor } from "@testing-library/react";

import { logger } from "@/logger";

import { initStoryblok } from "./initStoryblok";

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		storyblok: {
			ocelotEndpoint: "testEndpoint",
			accessToken: "testApiKey",
		},
	},
}));

describe("initStoryblok", () => {
	let consoleLogSpy: jest.SpyInstance;
	const loggerErrorSpy = jest.spyOn(logger, "error");
	const loggerInfoSpy = jest.spyOn(logger, "info");

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

		expect(loggerInfoSpy).toHaveBeenCalledWith("end initStoryblok");
	});

	it("should log an error when an exception is thrown", async () => {
		(storyblokInit as jest.Mock).mockImplementationOnce(() => {
			throw new Error("Test error");
		});

		initStoryblok();

		expect(loggerInfoSpy).toHaveBeenCalled();

		await waitFor(() => {
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				"Error initialising Storyblok: Error: Test error",
				{
					ocelotEndpoint: "testEndpoint",
					usingOcelotCache: true,
					originatingError: "Test error",
					error: new Error("Test error"),
				}
			);
		});
	});
});
