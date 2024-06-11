import { NextApiRequest, NextApiResponse } from "next";

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		//denyRobots not set
	},
}));

const normalizeString = (str: string): string => {
	return str.replace(/\s+/g, " ").trim();
};

describe("Robots txt API Handler Tests", () => {
	let req: NextApiRequest;
	let res: NextApiResponse;

	beforeEach(() => {
		req = {} as unknown as NextApiRequest;
		res = {
			send: jest.fn(),
			status: jest.fn().mockReturnThis(),
		} as unknown as NextApiResponse;
	});

	it('should return "Disallow: /" when denyRobots is "true"', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: "true",
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: *\nDisallow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is not "true"', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: "false",
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nAllow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is not set', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				// DenyRobots not set
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nAllow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is set to garbage value', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: "garbage",
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nAllow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is undefined', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: undefined,
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nAllow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is set to null', async () => {
		jest.resetModules();
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: null,
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		const expectedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nAllow: /`;

		expect(normalizeString(handlerSpy.mock.calls[0][0])).toBe(
			normalizeString(expectedString)
		);
	});
});
