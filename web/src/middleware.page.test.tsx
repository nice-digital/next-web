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

	it("should ignore _buildManifest.js file", () => {
		const req = new NextRequest(
			new Request(
				"http://www.nice.org.uk/_next/static/1fwfzfzjgtl2m8mqlorhm/_buildManifest.js"
			),
			{}
		);

		middleware(req);

		expect(redirectSpy).toHaveBeenCalledTimes(0);
	});

	it("should ignore _ssgManifest.js file", () => {
		const req = new NextRequest(
			new Request(
				"http://www.nice.org.uk/_next/static/1fwfzfzjgtl2m8mqlorhm/_ssgManifest.js"
			),
			{}
		);

		middleware(req);

		expect(redirectSpy).toHaveBeenCalledTimes(0);
	});
});
