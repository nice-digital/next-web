import { storyblokInit } from "@storyblok/react";

import { logger } from "@/logger";

import { initStoryblok } from "./initStoryblok";

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		storyblok: {
			ocelotEndpoint: "testEndpoint",
			previewAccessToken: "previewToken",
			publicAccessToken: "publicToken",
			storyblokApiKey: "testApiKey",
		},
	},
	serverRuntimeConfig: {
		storyblok: {
			previewAccessToken: "previewToken",
			publicAccessToken: "publicToken",
			storyblokApiKey: "testApiKey",
		},
	},
}));

jest.mock("@/logger", () => ({
	logger: {
		error: jest.fn(),
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
	});

	it("should log an error when an exception is thrown", () => {
		(storyblokInit as jest.Mock).mockImplementationOnce(() => {
			throw new Error("Test error");
		});

		initStoryblok();

		expect(logger.error).toHaveBeenCalledWith(
			"Error initialising Storyblok:",
			new Error("Test error")
		);
	});
});
