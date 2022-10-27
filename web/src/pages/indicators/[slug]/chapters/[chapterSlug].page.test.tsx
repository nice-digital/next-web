import { render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { useRouter } from "next/router";

import mockChapter from "@/mockData/publications/feeds/products/chapter/IndicatorChapterDetail.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import { client } from "../../../../feeds/";

import IndicatorChapterPage, {
	IndicatorChapterPageProps,
	getServerSideProps,
} from "./[chapterSlug].page";

import type { GetServerSidePropsContext } from "next";

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });

describe("/indicators/[slug]/chapters/[chapterSlug].page", () => {
	const slug =
		"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

	const chapterSlug = "indicator-nm181";

	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}/chapters/${chapterSlug}`,
		}));
		axiosMock.reset();
		axiosMock
			.onGet(/\/feeds\/product\/(.*)\/part\/1\/chapter\/(.*)/)
			.reply(200, mockChapter);
		axiosMock.onGet(/\/feeds\/product\//).reply(200, mockProduct);

		jest.resetModules();
	});

	describe("IndicatorChapterPage", () => {
		let props: IndicatorChapterPageProps;
		beforeEach(async () => {
			const context = {
				params: { slug: slug, chapterSlug: chapterSlug },
			} as unknown as GetServerSidePropsContext;

			props = (
				(await getServerSideProps(context)) as {
					props: IndicatorChapterPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<IndicatorChapterPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render a chapter heading h2", () => {
			render(<IndicatorChapterPage {...props} />);

			expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
				"Indicator NM181"
			);
		});

		describe("getServerSidePropsFunc", () => {
			it("should return a correct props when supplied with an id", async () => {
				const result = await getServerSideProps({
					params: { slug, chapterSlug: chapterSlug },
				} as unknown as GetServerSidePropsContext);

				expect(result).toStrictEqual({
					props: {
						slug: slug,
						product: expect.objectContaining({ id: "IND1001" }),
						chapterContent: expect.objectContaining({
							chapterSlug: "indicator-nm181",
						}),
					},
				});
			});

			it("should return permanent redirect object URL with incorrect title and correct chapter slug", async () => {
				const redirectResult = await getServerSideProps({
					params: { slug: "ind1001-incorrect-slug-title", chapterSlug },
				} as unknown as GetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/${slug}/chapters/${chapterSlug}`,
						permanent: true,
					},
				});
			});

			it("should return notFound if chapter slug doesn't exist", async () => {
				const redirectResult = await getServerSideProps({
					params: { slug: slug, chapterSlug: "this-does-not-exist" },
				} as unknown as GetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
