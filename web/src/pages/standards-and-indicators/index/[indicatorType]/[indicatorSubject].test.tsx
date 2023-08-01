import { GetServerSidePropsContext } from "next";

import { getServerSideProps, type Params } from "./[indicatorSubject]";

describe("getServerSideProps", () => {
	it("should ignore both type and subject of 'All'", async () => {
		const redirectResult = await getServerSideProps({
			params: {
				indicatorType: "All",
				indicatorSubject: "All",
			},
		} as unknown as GetServerSidePropsContext<Params>);

		expect(redirectResult).toStrictEqual({
			redirect: {
				permanent: true,
				destination: `/indicators/published?`,
			},
		});
	});

	it.each([
		["QOF", "General practice indicators suitable for use in QOF"],
		["CCG", "Clinical commissioning group indicators"],
		[
			"GPQualityImprovement",
			"General practice indicators suitable for use outside of QOF",
		],
		["NationalLibrary", "National library of quality indicators"],
	])(
		"should redirect to published list page from '%s' type param with rty filter of '%s'",
		async (indicatorType, expectedQuery) => {
			const redirectResult = await getServerSideProps({
				params: {
					indicatorType,
					indicatorSubject: "All",
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

	it("should redirect to just subject with type of 'All'", async () => {
		const redirectResult = await getServerSideProps({
			params: {
				indicatorType: "All",
				indicatorSubject: "Asthma",
			},
		} as unknown as GetServerSidePropsContext<Params>);

		expect(redirectResult).toStrictEqual({
			redirect: {
				permanent: true,
				destination: `/indicators/published?sub=Asthma`,
			},
		});
	});

	it("should redirect published list with type and subject", async () => {
		const redirectResult = await getServerSideProps({
			params: {
				indicatorType: "NationalLibrary",
				indicatorSubject: "Asthma",
			},
		} as unknown as GetServerSidePropsContext<Params>);

		expect(redirectResult).toStrictEqual({
			redirect: {
				permanent: true,
				destination: `/indicators/published?rty=National+library+of+quality+indicators&sub=Asthma`,
			},
		});
	});
});
