import { render, screen, waitFor, within } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { RelatedProductsProps } from "@/components/RelatedProducts/RelatedProducts";
import ng100 from "@/mockData/publications/feeds/product/ng100.json";

import IndicatorsDetailsPage, {
	getServerSideProps,
	IndicatorsDetailsPageProps,
} from "./index.page";

type IndicatorDetailsPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

const productRoot = "guidance",
	slug = "ng100",
	resolvedUrl = `/${productRoot}/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("/indicators/[slug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/guidance/ng100#somewhere`,
		}));
	});

	describe("IndicatorDetailPage", () => {
		let props: IndicatorsDetailsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
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
				expect(document.title).toEqual(`${ng100.Title} | Indicators`);
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
					).toHaveAttribute("content", ng100.MetaDescription);
				});
			});

			it("should render the correct page meta tags for DCTERMS.issued", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.issued"]`)
					).toHaveAttribute("content", ng100.PublishedDate);
				});
			});

			it("should render the correct page meta tags for DCTERMS.modified", async () => {
				render(<IndicatorsDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.modified"]`)
					).toHaveAttribute("content", ng100.LastMajorModificationDate);
				});
			});

			it("should render multiple meta tags for DCTERMS.type", async () => {
				render(
					<IndicatorsDetailsPage
						{...props}
						product={{
							...props.product,
							indicatorSubTypeList: ["CCG", "GPIQ"],
						}}
						indicatorSubTypes={[
							{
								links: {
									self: [{}],
								},
								eTag: null,
								lastModified: "2022-07-12T00:00:00",
								enabled: true,
								name: "Clinical commissioning group indicator",
								pluralName: "Clinical commissioning group indicators",
								identifierPrefix: "CCG",
							},
							{
								links: {
									self: [{}],
								},
								eTag: null,
								lastModified: "2022-07-12T00:00:00",
								enabled: true,
								name: "General practice indicator suitable for use in QOF",
								pluralName:
									"General practice indicators suitable for use in QOF",
								identifierPrefix: "GPIQ",
							},
						]}
					/>
				);
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
					).toHaveAttribute("content", ng100.Id);
				});
			});
		});

		describe("Chapter menu", () => {
			it("should render overview chapter link when summary provided", () => {
				render(
					<IndicatorsDetailsPage
						{...props}
						product={{
							...props.product,
							summary: ng100.Summary,
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

		describe("Related quality standards", () => {
			it("should only render products with IDs starting with 'QS' and relationship is 'IsTheBasisOf'", () => {
				const relatedProducts: RelatedProductsProps["relatedProducts"] = [
					{
						id: "QS1",
						title: "Product 1",
						url: "/product-1",
						relationship: "IsTheBasisOf",
						shortTitle: "Prod 1",
					},
					{
						id: "QS2",
						title: "Product 2",
						url: "/product-2",
						relationship: "IsTheBasisOf",
						shortTitle: "Prod 2",
					},
					{
						id: "ABC3",
						title: "Product 3",
						url: "/product-3",
						relationship: "IsTheBasisOf",
						shortTitle: "Prod 3",
					},
					{
						id: "QS4",
						title: "Product 4",
						url: "/product-4",
						relationship: "IsRelatedTo",
						shortTitle: "Prod 4",
					},
				];

				render(
					<IndicatorsDetailsPage
						{...props}
						product={{
							...props.product,
							relatedProductList: relatedProducts,
						}}
					/>
				);

				// Check that only products with IDs starting with 'QS' and relationship 'IsTheBasisOf' are rendered
				expect(screen.getByText("Product 1")).toBeInTheDocument();
				expect(screen.getByText("Product 2")).toBeInTheDocument();
				expect(screen.queryByText("Product 3")).not.toBeInTheDocument();
				expect(screen.queryByText("Product 4")).not.toBeInTheDocument();
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			const result = await getServerSideProps({
				params: { slug },
				query: { productRoot: "indicators" },
				resolvedUrl: `/indicators/${slug}`,
			} as unknown as IndicatorDetailsPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		describe("Redirects", () => {
			it("should return permanent redirect object URL with incorrect title for indicators", async () => {
				const incorrectSlug = "ind1001-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectSlug },
					query: { productRoot: "indicators" },
					resolvedUrl: `/indicators/${incorrectSlug}`,
				} as unknown as IndicatorDetailsPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded`,
						permanent: true,
					},
				});
			});
			it("should return not found if product doesn't exist", async () => {
				const notFoundIdSlug = "abc123";

				const notFoundResult = await getServerSideProps({
					params: { slug: notFoundIdSlug },
					resolvedUrl: `/${productRoot}/${notFoundIdSlug}`,
				} as IndicatorDetailsPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
