import { NextApiRequest, NextApiResponse } from "next";

import { normaliseString } from "@/test-utils/string";

const expectedRobotsAllowedString = `User-agent: bingbot\nCrawl-delay: 1\nUser-agent: *\nDisallow: /forms/* Disallow: /bnfc-via-nice-is-only-available-in-the-uk Disallow: /bnf-via-nice-is-only-available-in-the-uk Disallow: /cks-is-only-available-in-the-uk Disallow: /cks-end-user-licence-agreement Disallow: /bnfc-uk-only
Disallow: /bnf-uk-only
Disallow: /cks-uk-only
Disallow: /terms-and-conditions/cks-end-user-licence-agreement\nAllow: /`;
const expectedRobotsDeniedString = `User-agent: *\nDisallow: /`;

describe("Robots txt API Handler Tests", () => {
	let req: NextApiRequest;
	let res: NextApiResponse;

	beforeEach(() => {
		req = {} as unknown as NextApiRequest;
		res = {
			send: jest.fn(),
			status: jest.fn().mockReturnThis(),
		} as unknown as NextApiResponse;
		jest.resetModules();
	});

	it('should return "Disallow: /" when denyRobots is true', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: true,
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsDeniedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is not "true"', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: "false",
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsAllowedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is not set', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				// DenyRobots not set
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsAllowedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is set to garbage value', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: "garbage",
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsAllowedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is undefined', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: undefined,
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsAllowedString)
		);
	});

	it('should return "Allow: /" and "Crawl-delay: 1" for bingbot when denyRobots is set to null', async () => {
		jest.doMock("@/config", () => ({
			publicRuntimeConfig: {
				denyRobots: null,
			},
		}));

		const { default: handler } = await import("./robots.api");

		handler(req, res);

		const handlerSpy = jest.spyOn(res, "send");

		expect(handlerSpy).toHaveBeenCalledTimes(1);

		expect(normaliseString(handlerSpy.mock.calls[0][0])).toBe(
			normaliseString(expectedRobotsAllowedString)
		);
	});
});
