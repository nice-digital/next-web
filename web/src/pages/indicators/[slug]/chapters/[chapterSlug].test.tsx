import { render, screen, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import IndicatorChapterPage, {
	type IndicatorChapterPageProps,
	getServerSideProps,
} from "./[chapterSlug]";

type IndicatorChapterPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
	chapterSlug: string;
}>;

const productRoot = "guidance",
	slug = "ng100",
	chapterSlug = "recommendations",
	resolvedUrl = `/${productRoot}/${slug}/chapters/${chapterSlug}`,
	getServerSidePropsContext = {
		params: { slug, chapterSlug },
		resolvedUrl,
		query: {
			productRoot,
		},
	} as unknown as IndicatorChapterPageGetServerSidePropsContext;

describe("/indicators/[slug]/chapters/[chapterSlug].page", () => {
	beforeEach(() => {
		jest.mocked(useRouter).mockReturnValue({
			asPath: resolvedUrl,
			query: {
				productRoot,
			},
		} as unknown as ReturnType<typeof useRouter>);
	});

	describe("IndicatorChapterPage", () => {
		let props: IndicatorChapterPageProps;

		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: IndicatorChapterPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<IndicatorChapterPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<IndicatorChapterPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`Recommendations | NG100 | Indicators | Standards and Indicators`
				);
			});
		});

		it("should render a chapter heading h2", () => {
			render(<IndicatorChapterPage {...props} />);

			expect(
				screen.getByRole("heading", { level: 2, name: "Recommendations" })
			).toBeInTheDocument();
		});

		describe("Chapter sections", () => {
			it("should not render On This Page nav when there are no chapter sections", () => {
				const propsChapterSectionsEmpty = {
					...props,
					chapterSections: [],
				};
				render(<IndicatorChapterPage {...propsChapterSectionsEmpty} />);
				expect(
					screen.queryByRole("heading", { level: 2, name: "On this page" })
				).not.toBeInTheDocument();

				expect(
					screen.queryByRole("list", {
						name: "Jump links to sections on this page",
					})
				).not.toBeInTheDocument();
			});

			it("should not render On This Page nav when there is one chapter section", () => {
				const propsChapterSectionsEmpty = {
					...props,
					chapterSections: [
						{
							slug: "test-section-title-1",
							title: "test section title 1",
						},
					],
				};
				render(<IndicatorChapterPage {...propsChapterSectionsEmpty} />);
				expect(
					screen.queryByRole("heading", { level: 2, name: "On this page" })
				).not.toBeInTheDocument();

				expect(
					screen.queryByRole("list", {
						name: "Jump links to sections on this page",
					})
				).not.toBeInTheDocument();
			});

			it("should render On This Page nav when there is more than one chapterSection", () => {
				const propsChapterSectionsPopulated = {
					...props,
					chapterSections: [
						{
							slug: "referral-diagnosis-and-investigations",
							title: "1.1 Referral, diagnosis and investigations",
						},
						{
							slug: "treat-to-target-strategy",
							title: "1.2 Treat-to-target strategy",
						},
					],
				};
				render(<IndicatorChapterPage {...propsChapterSectionsPopulated} />);
				expect(
					screen.getByRole("heading", { level: 2, name: "On this page" })
				).toBeInTheDocument();

				expect(
					screen.getByRole("list", {
						name: "Jump links to sections on this page",
					})
				).toBeInTheDocument();
			});
		});

		describe("getServerSidePropsFunc", () => {
			it("should return a correct props when supplied with an id", async () => {
				const result = await getServerSideProps(getServerSidePropsContext);

				expect(result).toMatchSnapshot();
			});

			it("should return notFound if chapter slug doesn't exist", async () => {
				const notFoundResult = await getServerSideProps({
					...getServerSidePropsContext,
					resolvedUrl: `/${productRoot}/${slug}/chapters/this-does-not-exist`,
					params: { slug, chapterSlug: "this-does-not-exist" },
				} as unknown as IndicatorChapterPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});

			it("should return an empty array for chapter sections prop when chapter has no sections", async () => {
				const result = await getServerSideProps({
					...getServerSidePropsContext,
					params: { slug, chapterSlug: "context" },
				});

				expect(result).toHaveProperty("props.chapterSections", []);
			});
		});
	});
});
