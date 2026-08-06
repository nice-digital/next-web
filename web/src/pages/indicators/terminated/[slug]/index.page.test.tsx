import { render, screen, waitFor, within } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { RelatedProductsProps } from "@/components/RelatedProducts/RelatedProducts";
import ind1002 from "@/mockData/publications/feeds/product/ind1002.json";

import TerminatedDetailsPage, {
	getServerSideProps,
	TerminatedDetailsPageProps,
} from "./index.page";

type TerminatedDetailsPageGetServerSidePropsContext =
	GetServerSidePropsContext<{
		slug: string;
	}>;

const productRoot = "indicators",
	slug =
		"ind1002-test-terminated-indicator-ind-1002-the-percentage-of-patients-with-diabetes-who-have-received-a-foot-examination",
	resolvedUrl = `/indicators/terminated/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("/indicators/terminated/[slug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/terminated/${slug}`,
		}));
	});

	describe("TerminatedDetailsPage", () => {
		let props: TerminatedDetailsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: TerminatedDetailsPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<TerminatedDetailsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<TerminatedDetailsPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(`${ind1002.Title} | Indicators`);
			});
		});

		describe("Meta tags", () => {
			it("should have a link to the schema", async () => {
				render(<TerminatedDetailsPage {...props} />);
				// eslint-disable-next-line testing-library/no-node-access
				const schemaLink = document.querySelector(`link[rel="schema.DCTERMS"]`);
				await waitFor(() => {
					expect(schemaLink).toBeInTheDocument();
				});

				expect(schemaLink).toHaveAttribute("href", "http://purl.org/dc/terms/");
			});

			it("should render the correct page meta tags for description", async () => {
				render(<TerminatedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="description"]`)
					).toHaveAttribute("content", ind1002.MetaDescription);
				});
			});

			it("should render the correct page meta tags for DCTERMS.issued", async () => {
				render(<TerminatedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.issued"]`)
					).toHaveAttribute("content", ind1002.PublishedDate);
				});
			});

			it("should render the correct page meta tags for DCTERMS.modified", async () => {
				render(<TerminatedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.modified"]`)
					).toHaveAttribute("content", ind1002.LastMajorModificationDate);
				});
			});

			it("should render multiple meta tags for DCTERMS.type", async () => {
				render(
					<TerminatedDetailsPage
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
				render(<TerminatedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.identifier"]`)
					).toHaveAttribute("content", ind1002.Id);
				});
			});
		});

		describe("Breadcrumbs", () => {
			it("should render taxonomy breadcrumbs when taxonomyBreadcrumb is provided", () => {
				const taxonomyBreadcrumb = [
					{
						title: "Standards and indicators",
						url: "/standards-and-indicators",
					},
					{ title: "Indicators", url: "/standards-and-indicators/indicators" },
				];

				render(
					<TerminatedDetailsPage
						{...props}
						taxonomyBreadcrumb={taxonomyBreadcrumb}
					/>
				);

				expect(
					screen.getByText("Standards and indicators")
				).toBeInTheDocument();
				expect(screen.getByText("Indicators")).toBeInTheDocument();
			});

			it("should render default breadcrumbs when taxonomyBreadcrumb is empty", () => {
				render(
					<TerminatedDetailsPage {...props} taxonomyBreadcrumb={[]} />
				);

				const breadcrumbNav = screen.getByRole("navigation", {
					name: "Breadcrumbs",
				});

				expect(within(breadcrumbNav).getByText("Home")).toBeInTheDocument();
			});

			it("should render the product id as the final breadcrumb", () => {
				render(
					<TerminatedDetailsPage {...props} taxonomyBreadcrumb={[]} />
				);

				const breadcrumbNav = screen.getByRole("navigation", {
					name: "Breadcrumbs",
				});

				expect(
					within(breadcrumbNav).getByText(ind1002.Id)
				).toBeInTheDocument();
			});

			it("should pass terminated status to GuidanceBreadcrumb", () => {
				render(
					<TerminatedDetailsPage {...props} taxonomyBreadcrumb={[]} />
				);

				const breadcrumbNav = screen.getByRole("navigation", {
					name: "Breadcrumbs",
				});

				expect(
					within(breadcrumbNav).getByText("Terminated")
				).toBeInTheDocument();
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
				render(<TerminatedDetailsPage {...propsWithoutAlert} />);
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
				render(<TerminatedDetailsPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});

		describe("Chapter menu", () => {
			it("should render overview chapter link when summary provided", () => {
				render(
					<TerminatedDetailsPage
						{...props}
						product={{
							...props.product,
							summary: ind1002.Summary,
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
					<TerminatedDetailsPage
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
				resolvedUrl: `/indicators/terminated/${slug}`,
			} as unknown as TerminatedDetailsPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		it("should return taxonomyBreadcrumb in props", async () => {
			const result = (await getServerSideProps({
				params: { slug },
				query: { productRoot: "indicators" },
				resolvedUrl: `/indicators/terminated/${slug}`,
			} as unknown as TerminatedDetailsPageGetServerSidePropsContext)) as {
				props: TerminatedDetailsPageProps;
			};

			expect(result.props).toHaveProperty("taxonomyBreadcrumb");
			expect(Array.isArray(result.props.taxonomyBreadcrumb)).toBe(true);
		});

		describe("Redirects", () => {
			it("should return permanent redirect object URL with incorrect title for indicators", async () => {
				const incorrectSlug = "ind1002-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectSlug },
					query: { productRoot: "indicators" },
					resolvedUrl: `/indicators/terminated/${incorrectSlug}`,
				} as unknown as TerminatedDetailsPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/terminated/ind1002-test-terminated-indicator-ind-1002-the-percentage-of-patients-with-diabetes-who-have-received-a-foot-examination`,
						permanent: true,
					},
				});
			});

			it("should return not found if product doesn't exist", async () => {
				const notFoundIdSlug = "abc123";

				const notFoundResult = await getServerSideProps({
					params: { slug: notFoundIdSlug },
					resolvedUrl: `/indicators/terminated/${notFoundIdSlug}`,
				} as TerminatedDetailsPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
