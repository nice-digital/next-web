import {
	applyEnvironmentVariables,
	serverRuntimeConfig,
} from "../config/config";

describe("Config System", () => {
	beforeEach(() => {
		// Reset environment variables
		delete process.env.SEARCH_BASE_URL;
		delete process.env.PUBLICATIONS_BASE_URL;
		delete process.env.INDEV_BASE_URL;
		delete process.env.HOSTNAME;
		delete process.env.TEST_API_KEY;
		delete process.env.TEST_SEARCH_URL;
	});

	describe("applyEnvironmentVariables", () => {
		it("should substitute environment variables in config", () => {
			// Set test environment variables
			process.env.TEST_API_KEY = "my-test-key";
			process.env.TEST_SEARCH_URL = "https://test-search.example.com";

			const config = {
				server: {
					feeds: {
						publications: {
							apiKey: "default-key",
						},
					},
				},
				public: {
					search: {
						baseURL: "https://default-search.com",
					},
				},
			};

			const envMapping = {
				server: {
					feeds: {
						publications: {
							apiKey: "TEST_API_KEY",
						},
					},
				},
				public: {
					search: {
						baseURL: "TEST_SEARCH_URL",
					},
				},
			};

			const result = applyEnvironmentVariables(
				config,
				envMapping
			) as typeof config;

			expect(result.server.feeds.publications.apiKey).toBe("my-test-key");
			expect(result.public.search.baseURL).toBe(
				"https://test-search.example.com"
			);
		});

		it("should handle missing environment variables gracefully", () => {
			const config = {
				server: {
					feeds: {
						publications: {
							apiKey: "default-key",
						},
					},
				},
			};

			const envMapping = {
				server: {
					feeds: {
						publications: {
							apiKey: "MISSING_ENV_VAR",
						},
					},
				},
			};

			const result = applyEnvironmentVariables(
				config,
				envMapping
			) as typeof config;

			// Should leave original values when env var is missing
			expect(result.server.feeds.publications.apiKey).toBe("default-key");
		});

		it("should handle nested object structures", () => {
			process.env.NESTED_VALUE = "nested-test-value";

			const config = {
				level1: {
					level2: {
						level3: {
							value: "original",
						},
					},
				},
			};

			const envMapping = {
				level1: {
					level2: {
						level3: {
							value: "NESTED_VALUE",
						},
					},
				},
			};

			const result = applyEnvironmentVariables(
				config,
				envMapping
			) as typeof config;
			expect(result.level1.level2.level3.value).toBe("nested-test-value");
		});

		it("should handle null or undefined inputs", () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(applyEnvironmentVariables(null as any, {})).toBeNull();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(applyEnvironmentVariables({}, null as any)).toEqual({});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(applyEnvironmentVariables(undefined as any, {})).toBeUndefined();
		});
	});

	describe("Test Environment Config", () => {
		it("should return mock config values in test environment", () => {
			const config = serverRuntimeConfig;

			expect(config.cache.keyPrefix).toBe("next-web:tests");
			expect(config.feeds.publications.apiKey).toBe("TEST_API_KEY");
			expect(config.feeds.inDev.apiKey).toBe("TEST_API_KEY");
			expect(config.feeds.jotForm.apiKey).toBe("TEST_API_KEY");
		});

		it("should use test-specific cache configuration", () => {
			const config = serverRuntimeConfig;

			expect(config.cache.filePath).toBe("./.cache-test/");
			expect(config.cache.defaultTTL).toBe(300);
			expect(config.cache.longTTL).toBe(86400);
			expect(config.cache.refreshThreshold).toBe(150);
		});

		it("should use localhost URLs for test feeds", () => {
			const config = serverRuntimeConfig;

			expect(config.feeds.publications.origin).toBe(
				"http://publications.localhost:8080"
			);
			expect(config.feeds.inDev.origin).toBe("http://indev.localhost:8080");
		});
	});
});
