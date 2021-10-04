import mockDate from "mockdate";
import { GetServerSidePropsContext } from "next";

import { getRedirectUrl } from "./redirects";

describe("getRedirectUrl", () => {
	it("should return url as-is when no querystrings matching", () => {
		const context = {
			resolvedUrl: "/guidance/published?test=true",
			query: { test: "true" },
		} as unknown as GetServerSidePropsContext;

		expect(getRedirectUrl(context)).toBe(null);
	});

	describe("Area of interest", () => {
		it("should return redirect URL for single area of interest", () => {
			const context = {
				resolvedUrl: "/guidance/published?area=amp",
				query: { area: "amp" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?nai=Antimicrobial%20prescribing"
			);
		});

		it("should return redirect URL for multiple area of interest", () => {
			const context = {
				resolvedUrl: "/guidance/published?area=amp,cov",
				query: { area: "amp,cov" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?nai=Antimicrobial%20prescribing&nai=COVID-19"
			);
		});

		it("should ignore unknown area of interest in redirect URL", () => {
			const context = {
				resolvedUrl: "/guidance/published?area=amp,cov,BLAH",
				query: { area: "amp,cov" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?nai=Antimicrobial%20prescribing&nai=COVID-19"
			);
		});
	});

	describe("Dates", () => {
		beforeEach(() => {
			mockDate.set("2020-11-22");
		});

		afterEach(() => {
			mockDate.reset();
		});

		it("should redirect from and to dates in ISO format", () => {
			const context = {
				resolvedUrl:
					"/guidance/published?fromdate=January%202021&todate=March%202021",
				query: { fromdate: "January 2021", todate: "March 2021" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?from=2021-01-01&to=2021-03-31"
			);
		});

		it("should redirect from date in ISO format with to date default as today", () => {
			const context = {
				resolvedUrl: "/guidance/published?fromdate=January%202021",
				query: { fromdate: "January 2021" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?from=2021-01-01&to=2020-11-22"
			);
		});

		it("should redirect to date end of month in ISO format with from date default as Jan 2000", () => {
			const context = {
				resolvedUrl: "/guidance/published?to=March%202021",
				query: { todate: "March 2021" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?to=2021-03-31&from=2000-01-01"
			);
		});
	});

	describe("Types", () => {
		it("should redirect Guidelines type to ngt of guidelines", () => {
			///guidance/published?type=Guidelines
			const context = {
				resolvedUrl: "/guidance/published?type=Guidelines",
				query: {
					type: "Guidelines",
				},
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ngt=NICE%20guidelines"
			);
		});

		it("should redirect all selected types to Guidance, QS and Advice ndt filter", () => {
			const context = {
				resolvedUrl:
					"/guidance/published?type=apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta,es,ktt,mib",
				query: {
					type: "apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta,es,ktt,mib",
				},
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ndt=Guidance&ndt=Advice&ndt=Quality%20standard"
			);
		});

		it("should redirect all selected guidance types to Guidance and QS ndt filter", () => {
			const context = {
				resolvedUrl:
					"/guidance/published?type=apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta",
				query: { type: "apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ndt=Guidance&ndt=Quality%20standard"
			);
		});

		it("should redirect all selected advice types to Advice ndt filter", () => {
			const context = {
				resolvedUrl: "/guidance/published?type=es,ktt,mib",
				query: { type: "es,ktt,mib" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe("/guidance/published?ndt=Advice");
		});

		it("should redirect qs type to Quality standard ndt filter", () => {
			const context = {
				resolvedUrl: "/guidance/published?type=qs",
				query: { type: "qs" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ndt=Quality%20standard"
			);
		});

		it("should redirect single guidance programme to ngt filter", () => {
			const context = {
				resolvedUrl: "/guidance/published?type=ta",
				query: { type: "ta" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ngt=Technology%20appraisal&ndt=Guidance"
			);
		});

		it("should redirect single advice programme to nat filter", () => {
			const context = {
				resolvedUrl: "/guidance/published?type=es",
				query: { type: "es" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?nat=Evidence%20summaries&ndt=Advice"
			);
		});

		it("should redirect single guidance programme to ngt filter and all advice to ndt of Advice", () => {
			const context = {
				resolvedUrl: "/guidance/published?type=ta,es,ktt,mib",
				query: { type: "ta,es,ktt,mib" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?ngt=Technology%20appraisal&ndt=Advice&ndt=Guidance"
			);
		});

		it("should redirect single advice programme to nat filter and all guidance to ndt of Guidance", () => {
			const context = {
				resolvedUrl:
					"/guidance/published?type=apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta,es",
				query: { type: "apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta,es" },
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?nat=Evidence%20summaries&ndt=Guidance&ndt=Quality%20standard&ndt=Advice"
			);
		});
	});

	describe("title query", () => {
		it("should redirect title query into q query", () => {
			const context = {
				resolvedUrl: "/guidance/published?title=diabetes%20type%201",
				query: {
					title: "diabetes type 1",
				},
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?q=diabetes%20type%201"
			);
		});
	});

	describe("Combinations", () => {
		it("should redirect combinations of queries", () => {
			const context = {
				resolvedUrl: "/guidance/published?seeparamsbelow",
				query: {
					title: "diabetes type 1",
					type: "ta,qs,es,ktt,mib",
					area: "amp",
					fromdate: "January 2020",
					todate: "March 2020",
				},
			} as unknown as GetServerSidePropsContext;

			expect(getRedirectUrl(context)).toBe(
				"/guidance/published?q=diabetes%20type%201&from=2020-01-01&to=2020-03-31&nai=Antimicrobial%20prescribing&ngt=Technology%20appraisal&ndt=Advice&ndt=Quality%20standard&ndt=Guidance"
			);
		});
	});
});
