import { GetServerSidePropsContext } from "next";

import { getServerSideProps, type Params } from "./index.page";

describe("getServerSideProps", () => {
	it.each([
		["qofindicators", "General practice indicators suitable for use in QOF"],
		["ccgoisindicators", "Clinical commissioning group indicators"],
		[
			"gpqualityimprovements",
			"General practice indicators suitable for use outside of QOF",
		],
		["nlindicators", "National library of quality indicators"],
	])(
		"should redirect to published list page from '%s' type param with rty filter of '%s'",
		async (indicatorType, expectedQuery) => {
			const redirectResult = await getServerSideProps({
				params: {
					indicatorType,
				},
			} as unknown as GetServerSidePropsContext<Params>);

			expect(redirectResult).toStrictEqual({
				redirect: {
					permanent: true,
					destination: `/indicators/published?rty=${expectedQuery.replace(
						/\s/g,
						"+"
					)}`,
				},
			});
		}
	);

	it("should return not found for uknown indicator type slug", async () => {
		const notFoundResult = await getServerSideProps({
			params: {
				indicatorType: "UKNOWN",
			},
		} as unknown as GetServerSidePropsContext<Params>);

		expect(notFoundResult).toStrictEqual({
			notFound: true,
		});
	});
});
