import {
	queryByRole,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/inDev/types";
import gidng10237 from "@/mockData/inDev/project/gid-ng10237.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import IndevelopmentPage from "../../indevelopment.page";

import InDevelopmentPage, {
	getServerSideProps,
	InDevelopmentPageProps,
} from "./index.page";

const productRoot = "indicators",
	slug = "gid-ng10237",
	resolvedUrl = `/${productRoot}/indevelopment/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

describe("/indevelopment/[slug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: resolvedUrl,
		}));
	});

	describe("IndevelopmentPage", () => {
		let props: InDevelopmentPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: InDevelopmentPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<InDevelopmentPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<InDevelopmentPage {...props} />);
			// eslint-disable-next-line testing-library/no-debugging-utils
			// console.log(screen.debug());
			await waitFor(() => {
				expect(document.title).toEqual(
					`Project information | Adrenal insufficiency: acute and long-term management | Indicators | Standards and Indicators`
				);
			});
		});

		it("should render a non-linked breadcrumb for the project id", () => {
			render(<InDevelopmentPage {...props} />);
			const navigation = screen.getByRole("navigation", {
				name: "Breadcrumbs",
			});
			const idBreadcrumb = within(navigation).getByText("GID-NG10237");
			expect(idBreadcrumb).toBeInTheDocument();

			expect(
				screen.queryByRole("link", { name: "GID-NG10237" })
			).not.toBeInTheDocument();
		});

		it("should render a project information overview heading h1", () => {
			render(<InDevelopmentPage {...props} />);

			expect(
				screen.getByRole("heading", {
					level: 1,
					name: "Adrenal insufficiency: acute and long-term management",
				})
			).toBeInTheDocument();
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			await expect(
				getServerSideProps(getServerSidePropsContext)
			).resolves.toMatchSnapshot();
		});

		describe("Redirects", () => {
			it("should return permanent redirect object to the published product URL when project status is 'Complete'", async () => {
				axiosJSONMock.reset();
				axiosJSONMock
					.onGet(new RegExp(FeedPath.ProjectDetail))
					.reply(200, { ...gidng10237, status: "Complete" });
				addDefaultJSONFeedMocks();

				await expect(
					getServerSideProps(getServerSidePropsContext)
				).resolves.toStrictEqual({
					redirect: {
						destination: "/indicators/gid-ng10237-",
						permanent: true,
					},
				});
			});

			it("should return not found if project doesn't exist", async () => {
				const notFoundIdSlug = "abc123";

				axiosJSONMock.reset();
				axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});
				addDefaultJSONFeedMocks();

				expect(
					await getServerSideProps({
						...getServerSidePropsContext,
						params: { slug: notFoundIdSlug },
					})
				).toStrictEqual({
					notFound: true,
				});
			});
			it.todo("should reject when request is incorrect");
		});
	});
});
