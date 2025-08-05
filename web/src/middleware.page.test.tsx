/**
 * @jest-environment node
 */

import { NextResponse, NextRequest } from "next/server";

import { middleware } from "./middleware.page";

describe("Middleware", () => {
	const redirectSpy = jest.spyOn(NextResponse, "redirect");

	afterEach(() => {
		redirectSpy.mockReset();
	});

	it("should resolve a mixed case url as a lowercase url", () => {
		const req = new NextRequest(
			new Request(
				"http://www.nice.org.uk/StAnDArDs-aNd-iNdIcAtOrS/nLiNdIcAtOrS/"
			),
			{}
		);

		middleware(req);

		expect(redirectSpy).toHaveBeenCalledTimes(1);
		expect(redirectSpy).toHaveBeenCalledWith(
			new URL("http://www.nice.org.uk/standards-and-indicators/nlindicators/")
		);
	});
});