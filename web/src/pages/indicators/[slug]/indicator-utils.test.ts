import MockAdapter from "axios-mock-adapter";

import { client } from "@/feeds/index";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import { validateRouteParams } from "./indicator-utils";

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

describe("validateRouteParams", () => {
	const slug =
		"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

	beforeEach(() => {
		axiosMock.onGet(/\/feeds\/product\//).reply(200, mockProduct);

		axiosMock
			.onGet(/\/feeds\/indicatorsubtypes/)
			.reply(200, mockIndicatorSubTypes);
	});

	it("should redirect to correct overview path with incorrect slugified title", async () => {
		const result = await validateRouteParams(
			{
				slug: "ind1001-incorrect",
			},
			"/indicators/ind1001-incorrect"
		);

		expect(result).toStrictEqual({
			redirect: {
				destination: `/indicators/${slug}`,
				permanent: true,
			},
		});
	});

	it("should preserve querystring in redirect", async () => {
		const result = await validateRouteParams(
			{
				slug: "ind1001-incorrect",
			},
			"/indicators/ind1001-incorrect?somequery=true"
		);

		expect(result).toStrictEqual({
			redirect: {
				destination: `/indicators/${slug}?somequery=true`,
				permanent: true,
			},
		});
	});

	it("should redirect to correct chapter path with incorrect slugified title", async () => {
		const result = await validateRouteParams(
			{
				slug: "ind1001-incorrect",
			},
			"/indicators/ind1001-incorrect/chapters/anything?somequery=true"
		);

		expect(result).toStrictEqual({
			redirect: {
				destination: `/indicators/${slug}/chapters/anything?somequery=true`,
				permanent: true,
			},
		});
	});

	it("should redirect to correct PDF URL with incorrect slugified title", async () => {
		const result = await validateRouteParams(
			{
				slug: "ind1001-incorrect",
			},
			"/indicators/ind1001-incorrect/IND1001.pdf"
		);

		expect(result).toStrictEqual({
			redirect: {
				destination: `/indicators/${slug}/IND1001.pdf`,
				permanent: true,
			},
		});
	});
});
