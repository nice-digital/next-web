import { render, screen, waitFor, within } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/inDev/types";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import InDevelopmentPage, {
	getServerSideProps,
	InDevelopmentPageProps,
} from "./index.page";

const productRoot = "guidance",
	statusSlug = "indevelopment",
	slug = "gid-ng10237",
	resolvedUrl = `/${productRoot}/${statusSlug}/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot, statusSlug },
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

			await waitFor(() => {
				expect(document.title).toEqual(
					`Adrenal insufficiency: acute and long-term management | Indicators`
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

		it("should render related links", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "cg189-update-1",
					},
					resolvedUrl: "/indicators/indevelopment/cg189-update-1",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(
				screen.getByRole("heading", { name: "Related Links", level: 3 })
			).toBeInTheDocument();

			const relatedLink = screen.getByText(
				"Weight Management: preventing, assessing and managing overweight and obesity (update)"
			);

			expect(relatedLink).toBeInTheDocument();

			expect(relatedLink).toHaveAttribute(
				"href",
				"https://www.nice.org.uk/guidance/indevelopment/gid-ng10182/documents"
			);
		});

		it("should render 'register an interest in this interventional procedure' link when projectType starts 'IPG' ", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ip1046",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ip1046",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			const interventionLink = screen.getByRole("link", {
				name: "Register an interest in this interventional procedure",
			});

			expect(interventionLink).toBeInTheDocument();
			expect(interventionLink).toHaveAttribute(
				"href",
				"/about/what-we-do/our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance/IP-register-an-interest"
			);
		});

		it("should render further information links", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-tag383",
					},
					resolvedUrl: "/indicators/indevelopment/gid-tag383",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			const furtherInfoLink = screen.getByRole("link", {
				name: "CHTE processes and methods manual default",
			});

			expect(
				screen.getByText(
					"For further information on our processes and methods, please see our"
				)
			).toBeInTheDocument();

			expect(furtherInfoLink).toBeInTheDocument();
			expect(furtherInfoLink).toHaveAttribute(
				"href",
				"https://www.nice.org.uk/process/pmg20/chapter/introduction"
			);
		});

		it("should render email enquiries mailto link", () => {
			render(<InDevelopmentPage {...props} />);

			const link = screen.getByRole("link", {
				name: "hypoadrenalism@nice.org.uk",
			});

			expect(link).toBeInTheDocument();

			expect(link).toHaveAttribute("href", "mailto:hypoadrenalism@nice.org.uk");
		});

		it("should render topic areas", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-tag360",
					},
					resolvedUrl: "/indicators/indevelopment/gid-tag360",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(screen.getByText("Topic area:")).toBeInTheDocument();

			const topicAreaList = screen.getByRole("list", { name: "Topic areas" });
			expect(within(topicAreaList).getByText("Cancer")).toBeInTheDocument();
			expect(
				within(topicAreaList).getByText("Digestive system")
			).toBeInTheDocument();
		});

		it("should render full update information links", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-qs10170",
					},
					resolvedUrl: "/indicators/indevelopment/gid-qs10170",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(
				screen.getByText("This guidance will fully update the following:")
			).toBeInTheDocument();
			const updateLink = screen.getByRole("link", {
				name: "Acute kidney injury (QS76)",
			});
			expect(updateLink).toBeInTheDocument();
			expect(updateLink).toHaveAttribute("href", "/guidance/qs76");
		});

		it("should render partial update information links", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ng10364",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ng10364",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			const updateLink = screen.getByRole("link", {
				name: "Atopic eczema in under 12s: diagnosis and management (CG57)",
			});
			expect(
				screen.getByText("This guidance will partially update the following:")
			).toBeInTheDocument();
			expect(updateLink).toBeInTheDocument();
			expect(updateLink).toHaveAttribute("href", "/guidance/cg57");
		});

		it("should render suspend discontinued reason", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ip1153",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ip1153",
					query: { productRoot, statusSlug: "discontinued" },
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(screen.getByTestId("suspendDiscontinuedReason")).toHaveTextContent(
				"Discontinued"
			);
		});

		it("should render project team", () => {
			render(<InDevelopmentPage {...props} />);
			expect(
				screen.getByRole("heading", { level: 3, name: "Project Team" })
			).toBeInTheDocument();

			const projectTeamList = screen.getByLabelText("Project team");
			const { getAllByRole, getByText } = within(projectTeamList);
			const projectTeamItems = getAllByRole("definition");
			expect(projectTeamItems.length).toBe(1);
			expect(getByText("Developer").tagName).toBe("DT");
			expect(getByText("National Guideline Centre").tagName).toBe("DD");
		});

		it("should render provisional schedule", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-dg10049",
					},
					resolvedUrl: "/indicators/indevelopment/gid-dg10049",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(
				screen.getByRole("heading", { level: 3, name: "Provisional Schedule" })
			).toBeInTheDocument();

			const provisionalScheduleList = screen.getByLabelText(
				"Provisional schedule"
			);
			const { getAllByRole, getByText } = within(provisionalScheduleList);
			const provisionalScheduleItems = getAllByRole("definition");
			expect(provisionalScheduleItems.length).toBe(2);
			expect(getByText("Committee meeting: 2").tagName).toBe("DT");
			expect(getByText("16 February 2023").tagName).toBe("DD");
		});

		it("should render project status formatted display name", () => {
			render(<InDevelopmentPage {...props} />);
			const list = screen.getByLabelText("Project information");
			const { getByText } = within(list);
			expect(getByText("Status:").tagName).toBe("DT");
			expect(getByText("In progress").tagName).toBe("DD");
		});

		it("should render expected publication date metadata as time tag with correct formatted date", () => {
			render(<InDevelopmentPage {...props} />);

			expect(screen.getByText("Expected publication date:").tagName).toBe(
				"SPAN"
			);

			const dates = screen.getAllByText("11 April 2024")[0] as HTMLElement;

			expect(dates.tagName).toBe("TIME");
		});

		it("should render a link to the consultation overview page", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ipg10305",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ipg10305",
					query: { productRoot, statusSlug },
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			const consultationLink = screen.getByRole("link", {
				name: "Read the consultation documents",
			});

			expect(consultationLink).toBeInTheDocument();

			expect(consultationLink).toHaveAttribute(
				"href",
				"/guidance/indevelopment/gid-ipg10305/consultations/html-content"
			);
		});

		it("should not render a link to the consultation overview page when consultation content summary exists and there is no online commenting available (just PDF draft for commenting)", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ipg10307",
					},
					resolvedUrl: "/guidance/awaiting-development/gid-ipg10307",
					query: {
						productRoot: "guidance",
						statusSlug: "awaiting-development",
					},
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			const consultationLink = screen.queryByRole("link", {
				name: "Read the consultation documents",
			});

			expect(consultationLink).not.toBeInTheDocument();
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props when supplied with a valid slug", async () => {
			await expect(
				getServerSideProps(getServerSidePropsContext)
			).resolves.toMatchSnapshot();
		});

		describe("Redirects", () => {
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
