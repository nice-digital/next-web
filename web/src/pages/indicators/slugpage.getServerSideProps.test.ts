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
			Id: "IND1",
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
		it("should return notFound if Id doesn't exist", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "nonExistingId99-test-title-1" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({ notFound: true });
		});

		it("should return notFound if an unhyphenated slug is used", async () => {
			const redirectResult = await getServerSideProps({
				params: { slug: "slugwithouthyphenation" },
			} as unknown as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({ notFound: true });
		});

		//TODO check logic for any missing cases
	});
});
