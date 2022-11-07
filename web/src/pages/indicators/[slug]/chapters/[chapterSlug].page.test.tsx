import { render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockChapter from "@/mockData/publications/feeds/products/chapter/IndicatorChapterDetail.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import IndicatorChapterPage, {
	type IndicatorChapterPageProps,
	getServerSideProps,
} from "./[chapterSlug].page";

type IndicatorChapterPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	chapterSlug: string;
}>;

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });

describe("/indicators/[slug]/chapters/[chapterSlug].page", () => {
	const slug =
			"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded",
		chapterSlug = "indicator-nm181";

	beforeEach(() => {
		jest.mocked(useRouter).mockReturnValue({
			asPath: `/indicators/${slug}/chapters/${chapterSlug}`,
		} as ReturnType<typeof useRouter>);

		axiosMock
			.onGet(new RegExp(mockChapter._links.self[0].href))
			.reply(200, mockChapter)
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProduct);
	});

	describe("IndicatorChapterPage", () => {
		let props: IndicatorChapterPageProps;

		beforeEach(async () => {
			const context = {
				params: { slug, chapterSlug },
				resolvedUrl: `/indicators/${slug}/chapters/${chapterSlug}`,
			} as IndicatorChapterPageGetServerSidePropsContext;

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
					resolvedUrl: `/indicators/${slug}/chapters/${chapterSlug}`,
				} as IndicatorChapterPageGetServerSidePropsContext);

				expect(result).toMatchSnapshot();
			});

			it("should return permanent redirect object URL with incorrect title and correct chapter slug", async () => {
				const incorrectTitleSlug = "ind1001-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectTitleSlug, chapterSlug },
					resolvedUrl: `/indicators/${incorrectTitleSlug}/chapters/${chapterSlug}`,
				} as IndicatorChapterPageGetServerSidePropsContext);

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
				} as IndicatorChapterPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
