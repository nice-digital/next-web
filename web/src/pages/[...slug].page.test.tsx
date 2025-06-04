import { GetServerSidePropsContext } from "next";

jest.mock("@/utils/getCorporateContentGssp");

describe("SlugCatchAll getServerSideProps", () => {
	const mockContext = {
		params: { slug: ["about"] },
		query: {},
		resolvedUrl: "/about",
		res: { setHeader: jest.fn() },
	} as unknown as GetServerSidePropsContext;

	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	it("returns notFound when feature flag is disabled", async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				storyblok: {
					enableRootCatchAll: "false",
				},
			},
		}));

		jest.doMock("@/utils/getCorporateContentGssp", () => ({
			getCorporateContentGssp: jest.fn(),
		}));

		// Import after mocks are set (essential for jest.resetModules and jest.doMock)
		const { getServerSideProps } = await import("./[...slug].page");
		const { getCorporateContentGssp } = await import(
			"@/utils/getCorporateContentGssp"
		);

		const mockGetCorporateContentGssp = getCorporateContentGssp as jest.Mock;

		const result = await getServerSideProps(mockContext);

		expect(result).toEqual({ notFound: true });
		expect(mockGetCorporateContentGssp).not.toHaveBeenCalled();
	});

	it("calls getCorporateContentGssp when feature flag is enabled", async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				storyblok: {
					enableRootCatchAll: "true",
				},
			},
		}));

		// set up a mock handler that getCorporateContentGssp returns
		const gsspHandler = jest
			.fn()
			.mockResolvedValue({ props: { some: "data" } });

		// Mock getCorporateContentGssp to return the handler
		jest.doMock("@/utils/getCorporateContentGssp", () => ({
			getCorporateContentGssp: jest.fn(() => gsspHandler),
		}));

		// Import after mocks necessary with jest.resetModules() and jest.doMock() dynamic usage, because jest expects getCorporateContentGssp to be a mock function returning a function that returns a promise
		const { getServerSideProps } = await import("./[...slug].page");
		const { getCorporateContentGssp } = await import(
			"@/utils/getCorporateContentGssp"
		);

		const mockGetCorporateContentGssp = getCorporateContentGssp as jest.Mock;

		const result = await getServerSideProps(mockContext);

		expect(mockGetCorporateContentGssp).toHaveBeenCalledWith("root-catch-all");
		expect(gsspHandler).toHaveBeenCalledWith(mockContext);
		expect(result).toEqual({ props: { some: "data" } });
	});
});
