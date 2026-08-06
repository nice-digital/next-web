import { render, screen, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import ind1002 from "@/mockData/publications/feeds/product/ind1002.json";

import TerminatedChapterPage, {
	getServerSideProps,
	type TerminatedChapterPageProps,
} from "./[chapterSlug].page";

type TerminatedChapterPageGetServerSidePropsContext =
	GetServerSidePropsContext<{
		slug: string;
		chapterSlug: string;
	}>;

const productRoot = "indicators",
	slug =
		"ind1002-test-terminated-indicator-ind-1002-the-percentage-of-patients-with-diabetes-who-have-received-a-foot-examination",
	chapterSlug = "indicator-nm182",
	resolvedUrl = `/indicators/terminated/${slug}/chapter/${chapterSlug}`,
	getServerSidePropsContext = {
		params: { slug, chapterSlug },
		resolvedUrl,
		query: {
			productRoot,
		},
	} as unknown as TerminatedChapterPageGetServerSidePropsContext;

describe("/indicators/terminated/[slug]/chapter/[chapterSlug].page", () => {
	beforeEach(() => {
		jest.mocked(useRouter).mockReturnValue({
			asPath: resolvedUrl,
			query: {
				productRoot,
			},
		} as unknown as ReturnType<typeof useRouter>);
	});

	describe("TerminatedChapterPage", () => {
		let props: TerminatedChapterPageProps;

		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: TerminatedChapterPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<TerminatedChapterPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<TerminatedChapterPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`Indicator NM182 | ${ind1002.Id} | Indicators`
				);
			});
		});

		describe("Breadcrumbs", () => {
			it("should render taxonomy breadcrumbs when provided", () => {
				const taxonomyBreadcrumb = [
					{
						title: "Standards and indicators",
						url: "/standards-and-indicators",
					},
					{
						title: "Indicators",
						url: "/standards-and-indicators/indicators",
					},
				];

				render(
					<TerminatedChapterPage
						{...props}
						taxonomyBreadcrumb={taxonomyBreadcrumb}
					/>
				);

				expect(
					screen.getByText("Standards and indicators")
				).toBeInTheDocument();
				expect(screen.getByText("Indicators")).toBeInTheDocument();
			});

			it("should render terminated status breadcrumb when taxonomyBreadcrumb is empty", () => {
				render(
					<TerminatedChapterPage {...props} taxonomyBreadcrumb={[]} />
				);

				const breadcrumbNav = screen.getByRole("navigation", {
					name: "Breadcrumbs",
				});

				expect(breadcrumbNav).toBeInTheDocument();
			});
		});

		describe("InfoAlert", () => {
			it("should not appear when alert is null or undefined", () => {
				const propsWithoutAlert = {
					...props,
					product: {
						...props.product,
						alert: null,
					},
				};
				render(<TerminatedChapterPage {...propsWithoutAlert} />);
				expect(screen.queryByText("Info alert")).not.toBeInTheDocument();
			});

			it("should appear when we have an alert", () => {
				const propsWithAlert = {
					...props,
					product: {
						...props.product,
						alert: "Info alert",
					},
				};
				render(<TerminatedChapterPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});

		it("should render a chapter heading h2", () => {
			render(<TerminatedChapterPage {...props} />);

			expect(
				screen.getByRole("heading", { level: 2, name: "Indicator NM182" })
			).toBeInTheDocument();
		});

		describe("Chapter sections", () => {
			it("should not render On This Page nav when there are no chapter sections", () => {
				const propsChapterSectionsEmpty = {
					...props,
					chapterSections: [],
				};
				render(<TerminatedChapterPage {...propsChapterSectionsEmpty} />);
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
				render(<TerminatedChapterPage {...propsChapterSectionsEmpty} />);
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
							slug: "section-1",
							title: "1.1 Background",
						},
						{
							slug: "section-2",
							title: "1.2 Measurement",
						},
					],
				};
				render(<TerminatedChapterPage {...propsChapterSectionsPopulated} />);
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

		describe("getServerSideProps", () => {
			it("should return correct props when supplied with a valid slug and chapter slug", async () => {
				const result = await getServerSideProps(getServerSidePropsContext);

				expect(result).toMatchSnapshot();
			});

			it("should return taxonomyBreadcrumb in props", async () => {
				const result = (await getServerSideProps(
					getServerSidePropsContext
				)) as {
					props: TerminatedChapterPageProps;
				};

				expect(result.props).toHaveProperty("taxonomyBreadcrumb");
				expect(Array.isArray(result.props.taxonomyBreadcrumb)).toBe(true);
			});

			it("should return notFound if chapter slug doesn't exist", async () => {
				const notFoundResult = await getServerSideProps({
					...getServerSidePropsContext,
					resolvedUrl: `/indicators/terminated/${slug}/chapter/this-does-not-exist`,
					params: { slug, chapterSlug: "this-does-not-exist" },
				} as unknown as TerminatedChapterPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});

			it("should return an empty array for chapter sections prop when chapter has no sections", async () => {
				const result = await getServerSideProps({
					...getServerSidePropsContext,
					resolvedUrl: `/indicators/terminated/${slug}/chapter/rationale`,
					params: { slug, chapterSlug: "rationale" },
				} as unknown as TerminatedChapterPageGetServerSidePropsContext);

				expect(result).toHaveProperty("props.chapterSections", []);
			});
		});
	});
});
