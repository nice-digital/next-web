import {
	render,
	screen,
	waitFor,
	getDefaultNormalizer,
	within,
} from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import IndicatorsDetailsPage, {
	getServerSideProps,
	IndicatorsDetailsPageProps,
} from "./index.page";

type IndicatorDetailsPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

describe("/indicators/[slug].page", () => {
	const slug =
		"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}#somewhere`,
		}));
		axiosMock.reset();

		axiosMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, mockProduct);

		axiosMock
			.onGet(new RegExp(FeedPath.IndicatorSubTypes))
			.reply(200, mockIndicatorSubTypes);

		jest.resetModules();
	});

	describe("IndicatorDetailPage", () => {
		let props: IndicatorsDetailsPageProps;
		beforeEach(async () => {
			const context = {
				params: { slug: slug },
			} as IndicatorDetailsPageGetServerSidePropsContext;

			props = (
				(await getServerSideProps(context)) as {
					props: IndicatorsDetailsPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<IndicatorsDetailsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<IndicatorsDetailsPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`${mockProduct.Title} | Indicators | Standards and Indicators`
				);
			});
		});

		describe("Meta tags", () => {
			it("should have a link to the schema", async () => {
				render(<IndicatorsDetailsPage {...props} />);
				// eslint-disable-next-line testing-library/no-node-access
				const schemaLink = document.querySelector(`link[rel="schema.DCTERMS"]`);
				await waitFor(() => {
					expect(schemaLink).toBeInTheDocument();
				});

				expect(schemaLink).toHaveAttribute("href", "http://purl.org/dc/terms/");
			});

			it("should render the correct page meta tags for robots", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="robots"]`)
					).toHaveAttribute("content", "index,follow");
				});
			});

			it("should render the correct page meta tags for description", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="description"]`)
					).toHaveAttribute("content", mockProduct.MetaDescription);
				});
			});

			it("should render the correct page meta tags for DCTERMS.issued", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.issued"]`)
					).toHaveAttribute("content", mockProduct.PublishedDate);
				});
			});

			it("should render the correct page meta tags for DCTERMS.modified", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.modified"]`)
					).toHaveAttribute("content", mockProduct.LastMajorModificationDate);
				});
			});

			it("should render multiple meta tags for DCTERMS.type", async () => {
				render(<IndicatorsDetailsPage {...props} />);
				// eslint-disable-next-line testing-library/no-node-access
				const typeMetaTags = document.querySelectorAll(
					`meta[name="DCTERMS.type"]`
				);
				await waitFor(() => {
					expect(typeMetaTags).toHaveLength(2);
				});
				expect(typeMetaTags[0]).toHaveAttribute(
					"content",
					"Clinical commissioning group indicator"
				);
				expect(typeMetaTags[1]).toHaveAttribute(
					"content",
					"General practice indicator suitable for use in QOF"
				);
			});

			it("should render the correct page meta tags for DCTERMS.identifier", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.identifier"]`)
					).toHaveAttribute("content", mockProduct.Id);
				});
			});
		});

		describe("PageHeader", () => {
			it("should render meta data id in uppercase", () => {
				render(<IndicatorsDetailsPage {...props} />);
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
					<IndicatorsDetailsPage
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
					<IndicatorsDetailsPage
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
					<IndicatorsDetailsPage
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
				render(<IndicatorsDetailsPage {...props} />);
				const publishedDateEl = screen.getByText("8 September 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toBeInTheDocument();
			});

			it("should render 'Published' date page header lead meta element with correctly formatted datetime attribute", () => {
				render(<IndicatorsDetailsPage {...props} />);
				const publishedDateEl = screen.getByText("8 September 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toHaveAttribute("datetime", "2022-09-08");
			});

			it("should render 'Last updated' date page header lead meta element in the correct format", () => {
				render(
					<IndicatorsDetailsPage
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
				render(
					<IndicatorsDetailsPage
						{...props}
						product={{
							...props.product,
							lastMajorModificationDate: "2022-11-11T11:17:45.442351",
						}}
					/>
				);
				const publishedDateEl = screen.getByText("11 November 2022", {
					selector: "time",
				});
				expect(publishedDateEl).toHaveAttribute("datetime", "2022-11-11");
			});
		});

		describe("Chapter menu", () => {
			it("should render overview chapter link when summary provided", () => {
				render(
					<IndicatorsDetailsPage
						{...props}
						product={{
							...props.product,
							summary: mockProduct.Summary,
						}}
					/>
				);

				const publicationsChapterMenu = screen.getByRole("region", {
					name: "Chapters",
				});

				expect(
					within(publicationsChapterMenu).getByText("Overview")
				).toBeInTheDocument();
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			const result = await getServerSideProps({
				params: { slug },
				resolvedUrl: `/indicators/${slug}`,
			} as IndicatorDetailsPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		describe("Redirects", () => {
			it("should return permanent redirect object URL with incorrect title", async () => {
				const incorrectSlug = "ind1001-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectSlug },
					resolvedUrl: `/indicators/${incorrectSlug}`,
				} as IndicatorDetailsPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/${slug}`,
						permanent: true,
					},
				});
			});
			it("should return not found if product doesn't exist", async () => {
				const notFoundIdSlug = "nonExistingId99-test-title-1";

				axiosMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});

				const notFoundResult = await getServerSideProps({
					params: { slug: notFoundIdSlug },
					resolvedUrl: `/indicators/${notFoundIdSlug}`,
				} as IndicatorDetailsPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
