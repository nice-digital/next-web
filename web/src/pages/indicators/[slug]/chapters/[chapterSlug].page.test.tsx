import {
	getDefaultNormalizer,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
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

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<IndicatorChapterPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`Indicator NM181 | IND1001 | Indicators | Standards and Indicators`
				);
			});
		});

		it("should render a chapter heading h2", () => {
			render(<IndicatorChapterPage {...props} />);

			expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
				"Indicator NM181"
			);
		});

		describe("PageHeader", () => {
			it("should render meta data id in uppercase", () => {
				render(<IndicatorChapterPage {...props} />);
				expect(
					screen.getByText(mockProduct.Id, {
						selector: ".page-header__metadata li",
					})
				).toBeInTheDocument();
			});

			it.each([
				["NICE indicator"],
				["IND1001"],
				["Published: 8 September 2022"],
				["Last updated: 12 October 2022"],
			])("should render a %s page header meta element", (metaContent) => {
				render(
					<IndicatorChapterPage
						{...props}
						product={{
							...props.product,
							lastMajorModificationDate: "2022-10-12",
						}}
					/>
				);

				expect(
					screen.getByText(
						(content, element) => {
							return (
								getDefaultNormalizer()(element?.textContent as string) ==
								metaContent
							);
						},
						{
							selector: ".page-header__metadata li",
						}
					)
				);
			});

			it("should not render last updated date if published date == lastModified date", () => {
				render(
					<IndicatorChapterPage
						{...props}
						product={{
							...props.product,
							lastMajorModificationDate: props.product.publishedDate,
						}}
					/>
				);

				expect(screen.queryByText("Last updated:")).not.toBeInTheDocument();
			});

			it("should render last updated date if published date !== lastModified date", () => {
				render(
					<IndicatorChapterPage
						{...props}
						product={{
							...props.product,
							lastMajorModificationDate: "2022-10-12",
						}}
					/>
				);

				expect(screen.getByText("Last updated:")).toBeInTheDocument();
			});

			it("should render 'Published' date page header lead meta element in the correct format", () => {
				render(<IndicatorChapterPage {...props} />);
				const publishedDateEl = screen.getByText("8 September 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toBeInTheDocument();
			});

			it("should render 'Published' date page header lead meta element with correctly formatted datetime attribute", () => {
				render(<IndicatorChapterPage {...props} />);
				const publishedDateEl = screen.getByText("8 September 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toHaveAttribute("datetime", "2022-09-08");
			});

			it("should not render 'Published' date page header lead meta element if no published date supplied", () => {
				render(
					<IndicatorChapterPage
						{...props}
						product={{
							...props.product,
							publishedDate: "",
						}}
					/>
				);

				expect(screen.queryByText("Published:")).not.toBeInTheDocument();
			});

			it("should render 'Last updated' date page header lead meta element in the correct format", () => {
				render(
					<IndicatorChapterPage
						{...props}
						product={{
							...props.product,
							lastMajorModificationDate: "2022-10-12",
						}}
					/>
				);
				const publishedDateEl = screen.getByText("12 October 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toBeInTheDocument();
			});

			it("should render 'Last updated' date page header lead meta element with correctly formatted datetime attribute", () => {
				render(<IndicatorChapterPage {...props} />);
				const publishedDateEl = screen.getByText("8 September 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toHaveAttribute("datetime", "2022-09-08");
			});
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
							slug: "test-section-title-1",
							title: "test section title 1",
						},
						{
							slug: "test-section-title-2",
							title: "test section title 2",
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

			it("should return an empty array for chapter sections prop when chapter section info is an object", async () => {
				axiosMock
					.onGet(new RegExp(mockChapter._links.self[0].href))
					.replyOnce(200, {
						...mockChapter,
						// Mock a response with a single chapter section object
						_embedded: { "nice.publications:html-chapter-section-info": {} },
					});

				const result = await getServerSideProps({
					params: { slug, chapterSlug: chapterSlug },
					resolvedUrl: `/indicators/${slug}/chapters/${chapterSlug}`,
				} as IndicatorChapterPageGetServerSidePropsContext);

				expect(result).toHaveProperty("props.chapterSections", []);
			});
		});
	});
});
