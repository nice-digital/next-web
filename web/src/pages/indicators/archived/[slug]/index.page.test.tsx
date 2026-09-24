import { render, screen, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import ind1112 from "@/mockData/publications/newfeeds/product/ind1112.json";

import ArchivedDetailsPage, {
	getServerSideProps,
	ArchivedDetailsPageProps,
} from "./index.page";

type ArchivedDetailsPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

const productRoot = "indicators",
	slug = "ind1112-indicator-master-accordion-panels-test",
	resolvedUrl = `/${productRoot}/archived/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("/indicators/archived/[slug]/index.page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/archived/ind1112#somewhere`,
		}));
	});

	describe("ArchivedDetailPage", () => {
		let props: ArchivedDetailsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: ArchivedDetailsPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<ArchivedDetailsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<ArchivedDetailsPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(`${ind1112.Title} | Indicators`);
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
				render(<ArchivedDetailsPage {...propsWithoutAlert} />);
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
				render(<ArchivedDetailsPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});

		describe("Meta tags", () => {
			it("should have a link to the schema", async () => {
				render(<ArchivedDetailsPage {...props} />);
				// eslint-disable-next-line testing-library/no-node-access
				const schemaLink = document.querySelector(`link[rel="schema.DCTERMS"]`);
				await waitFor(() => {
					expect(schemaLink).toBeInTheDocument();
				});

				expect(schemaLink).toHaveAttribute("href", "http://purl.org/dc/terms/");
			});

			it("should render the correct page meta tags for robots", async () => {
				render(<ArchivedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="robots"]`)
					).toHaveAttribute("content", "index,follow");
				});
			});

			it("should render the correct page meta tags for description", async () => {
				render(<ArchivedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="description"]`)
					).toHaveAttribute("content", ind1112.MetaDescription);
				});
			});

			it("should render the correct page meta tags for DCTERMS.issued", async () => {
				render(<ArchivedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.issued"]`)
					).toHaveAttribute("content", ind1112.PublishedDate);
				});
			});

			it("should render the correct page meta tags for DCTERMS.modified", async () => {
				render(<ArchivedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.modified"]`)
					).toHaveAttribute("content", ind1112.LastMajorModificationDate);
				});
			});

			it("should render multiple meta tags for DCTERMS.type", async () => {
				render(
					<ArchivedDetailsPage
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
				render(<ArchivedDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.identifier"]`)
					).toHaveAttribute("content", ind1112.Id);
				});
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			const result = await getServerSideProps({
				params: { slug },
				query: { productRoot: "indicators" },
				resolvedUrl: `/indicators/archived/${slug}`,
			} as unknown as ArchivedDetailsPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		describe("Redirects", () => {
			it("should return permanent redirect object URL with incorrect title for indicators", async () => {
				const incorrectSlug = "ind1112-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectSlug },
					query: { productRoot: "indicators" },
					resolvedUrl: `/indicators/archived/${incorrectSlug}`,
				} as unknown as ArchivedDetailsPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/archived/ind1112-indicator-master-accordion-panels-test`,
						permanent: true,
					},
				});
			});
			it("should return not found if product doesn't exist", async () => {
				const notFoundIdSlug = "abc123";

				const notFoundResult = await getServerSideProps({
					params: { slug: notFoundIdSlug },
					resolvedUrl: `/${productRoot}/archived/${notFoundIdSlug}`,
				} as ArchivedDetailsPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
