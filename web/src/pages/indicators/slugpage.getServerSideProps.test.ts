import slugify from "@sindresorhus/slugify";

import { getServerSideProps } from "./[slug].page";

import type { GetServerSidePropsContext, Redirect } from "next";

jest.mock("@/feeds/publications/publications", () => {
	const originalModule = jest.requireActual(
		"@/feeds/publications/publications"
	);

	//Mock the getProductDetail export
	return {
		__esModule: true,
		...originalModule,
		getProductDetail: jest.fn(() => ({
			Title: "Test title 1",
		})),
	};
});

describe("getGetServerSidePropsFunc", () => {
	describe("Redirects", () => {
		it("should return permanent redirect object URL with incorrect title", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "ind1-incorrect-slug-title" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({
				redirect: {
					destination: "/indicators/ind1-test-title-1",
					permanent: true,
				},
			});
		});
		it("should return 404 response status if Id doesn't exist", async () => {
			const res = {
				statusCode: 0,
				setHeader: jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
			};

			await getServerSideProps({
				params: { slug: "nonExistingId99-test-title-1" },
				res,
			} as unknown as GetServerSidePropsContext);

			console.log({ res });

			expect(res.statusCode).toBe(404);
		});

		it.todo("id with no dash and title");

		//TODO check logic for any missing cases
	});
});
