import { storyblokInit } from "@storyblok/react";
<<<<<<< HEAD
import { waitFor } from "@testing-library/react";
=======
>>>>>>> main

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

<<<<<<< HEAD
describe("initStoryblok", () => {
	let consoleLogSpy: jest.SpyInstance;
	const loggerErrorSpy = jest.spyOn(logger, "error");
	const loggerInfoSpy = jest.spyOn(logger, "info");
=======
jest.mock("@/logger", () => ({
	logger: {
		error: jest.fn(),
	},
}));

describe("initStoryblok", () => {
	let consoleLogSpy: jest.SpyInstance;
>>>>>>> main

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
<<<<<<< HEAD

		expect(loggerInfoSpy).toHaveBeenCalledWith("end initStoryblok");
	});

	it("should log an error when an exception is thrown", async () => {
=======
	});

	it("should log an error when an exception is thrown", () => {
>>>>>>> main
		(storyblokInit as jest.Mock).mockImplementationOnce(() => {
			throw new Error("Test error");
		});

		initStoryblok();

<<<<<<< HEAD
		expect(loggerInfoSpy).toHaveBeenCalled();

		await waitFor(() => {
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				{
					ocelotEndpoint: "testEndpoint",
					usingOcelotCache: true,
					originatingError: "Test error",
					error: new Error("Test error"),
				},
				"Error initialising Storyblok: Error: Test error"
			);
		});
=======
		expect(logger.error).toHaveBeenCalledWith(
			"Error initialising Storyblok:",
			new Error("Test error")
		);
>>>>>>> main
	});
});
