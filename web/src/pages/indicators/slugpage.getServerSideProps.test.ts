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
				resolvedUrl: "/indicators/ind1-incorrect-slug-title",
			} as GetServerSidePropsContext);

			expect(redirectResult).toStrictEqual({
				redirect: {
					destination: "/indicators/ind1-test-title-1",
					permanent: true,
				},
			});
		});
		it.todo("if id doesn't exist return not found");
		it.todo("id with no dash and title");

		//TODO check logic for any missing cases
	});
});
