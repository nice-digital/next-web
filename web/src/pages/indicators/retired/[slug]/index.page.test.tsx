import { render, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import ind1111 from "@/mockData/publications/newfeeds/product/ind1111.json";

import RetiredDetailsPage, {
	getServerSideProps,
	RetiredDetailsPageProps,
} from "./index.page";

type RetiredDetailsPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

const productRoot = "indicators",
	slug = "ind1111-indicator-master-accordion-panels-test",
	resolvedUrl = `/${productRoot}/retired/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("/indicators/retired/[slug]/index.page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/retired/ind1111#somewhere`,
		}));
	});

	describe("RetiredDetailPage", () => {
		let props: RetiredDetailsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: RetiredDetailsPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<RetiredDetailsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<RetiredDetailsPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(`${ind1111.Title} | Indicators`);
			});
		});

		describe("Meta tags", () => {
			it("should have a link to the schema", async () => {
				render(<RetiredDetailsPage {...props} />);
				// eslint-disable-next-line testing-library/no-node-access
				const schemaLink = document.querySelector(`link[rel="schema.DCTERMS"]`);
				await waitFor(() => {
					expect(schemaLink).toBeInTheDocument();
				});

				expect(schemaLink).toHaveAttribute("href", "http://purl.org/dc/terms/");
			});

			it("should render the correct page meta tags for robots", async () => {
				render(<RetiredDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="robots"]`)
					).toHaveAttribute("content", "index,follow");
				});
			});

			it("should render the correct page meta tags for description", async () => {
				render(<RetiredDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="description"]`)
					).toHaveAttribute("content", ind1111.MetaDescription);
				});
			});

			it("should render the correct page meta tags for DCTERMS.issued", async () => {
				render(<RetiredDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.issued"]`)
					).toHaveAttribute("content", ind1111.PublishedDate);
				});
			});

			it("should render the correct page meta tags for DCTERMS.modified", async () => {
				render(<RetiredDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.modified"]`)
					).toHaveAttribute("content", ind1111.LastMajorModificationDate);
				});
			});

			it("should render multiple meta tags for DCTERMS.type", async () => {
				render(
					<RetiredDetailsPage
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
				render(<RetiredDetailsPage {...props} />);

				await waitFor(() => {
					expect(
						// eslint-disable-next-line testing-library/no-node-access
						document.querySelector(`meta[name="DCTERMS.identifier"]`)
					).toHaveAttribute("content", ind1111.Id);
				});
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			const result = await getServerSideProps({
				params: { slug },
				query: { productRoot: "indicators" },
				resolvedUrl: `/indicators/retired/${slug}`,
			} as unknown as RetiredDetailsPageGetServerSidePropsContext);

			expect(result).toMatchSnapshot();
		});

		describe("Redirects", () => {
			it("should return permanent redirect object URL with incorrect title for indicators", async () => {
				const incorrectSlug = "ind1111-incorrect-slug-title";

				const redirectResult = await getServerSideProps({
					params: { slug: incorrectSlug },
					query: { productRoot: "indicators" },
					resolvedUrl: `/indicators/retired/${incorrectSlug}`,
				} as unknown as RetiredDetailsPageGetServerSidePropsContext);

				expect(redirectResult).toStrictEqual({
					redirect: {
						destination: `/indicators/retired/ind1111-indicator-master-accordion-panels-test`,
						permanent: true,
					},
				});
			});
			it("should return not found if product doesn't exist", async () => {
				const notFoundIdSlug = "abc123";

				const notFoundResult = await getServerSideProps({
					params: { slug: notFoundIdSlug },
					resolvedUrl: `/${productRoot}/retired/${notFoundIdSlug}`,
				} as RetiredDetailsPageGetServerSidePropsContext);

				expect(notFoundResult).toStrictEqual({ notFound: true });
			});
		});
	});
});
