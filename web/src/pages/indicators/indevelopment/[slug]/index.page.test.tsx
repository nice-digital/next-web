import { render, screen, waitFor, within } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath, TopicSelectionReason } from "@/feeds/inDev/types";
import gidng10237 from "@/mockData/inDev/project/gid-ng10237.json";
import gidta10992 from "@/mockData/inDev/project/gid-ta10992.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

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

		it.each([
			["Monitor", TopicSelectionReason.Monitor],
			["Anticipate", TopicSelectionReason.Anticipate],
			["NotEligible", TopicSelectionReason.NotEligible],
			["FurtherDiscussion", TopicSelectionReason.FurtherDiscussion],
		])(
			"should render text when a topic selection reason %s exists, topic reason text: %s",
			async (topicSelectionReason, topicSelectionReasonText) => {
				axiosJSONMock.reset();
				axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(200, {
					...gidta10992,
					topicSelectionReason: topicSelectionReason,
				});
				addDefaultJSONFeedMocks();

				props = (
					(await getServerSideProps({
						...getServerSidePropsContext,
						params: {
							slug: "gid-ta10992",
						},
						resolvedUrl: "/indicators/indevelopment/gid-ta10992",
					})) as {
						props: InDevelopmentPageProps;
					}
				).props;

				render(<InDevelopmentPage {...props} />);

				expect(screen.getByTestId("reason")).toBeInTheDocument();

				expect(screen.getByTestId("reason")).toHaveTextContent(
					`Reason for decision: ${topicSelectionReasonText}`
				);
			}
		);

		it("should render 'Developed as: [Process]' when status != TopicSelection and ProjectType='NG' ", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ng10163",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ng10163",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(screen.getByText("Developed as: APG")).toBeInTheDocument();
		});

		it("should render 'Process: [Process]' when status != TopicSelection and ProjectType != 'NG'", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-hst10044",
					},
					resolvedUrl: "/indicators/indevelopment/gid-hst10044",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(screen.getByText("Process: HST")).toBeInTheDocument();
		});

		it("should reder 'Notification date' when Process =='MT' ", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-mt130",
					},
					resolvedUrl: "/indicators/indevelopment/gid-mt130",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(screen.getByText("Process: MT")).toBeInTheDocument();
			expect(
				screen.getByText("Notification date: February 2010")
			).toBeInTheDocument();
		});

		it("should render 'Referral date' when Process != 'MT ", async () => {
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

			expect(screen.getByText("Referral date:").tagName).toBe("P");
			const dates = screen.getAllByText("1 November 2005")[0] as HTMLElement;
			expect(dates.tagName).toBe("TIME");
			//TODO Check datetime attribute format
			// expect(dates).toHaveAttribute("datetime", "2020-05-11");
		});

		it("should render related links", async () => {
			//TODO check formatting and location of related links
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
				screen.getByText(
					"Weight Management: preventing, assessing and managing overweight and obesity (update)"
				)
			).toBeInTheDocument();

			expect(
				screen.getByText(
					"https://www.nice.org.uk/guidance/indevelopment/gid-ng10182/documents"
				)
			).toBeInTheDocument();
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

		describe("ProjectHeading", () => {
			it("should render expected publication date metadata as time tag with correct formatted date", () => {
				render(<InDevelopmentPage {...props} />);

				expect(screen.getByText("Expected publication date").tagName).toBe(
					"SPAN"
				);

				const dates = screen.getAllByText("11 April 2024")[0] as HTMLElement;

				expect(dates.tagName).toBe("TIME");
				//TODO Check datetime attribute format
				// expect(dates).toHaveAttribute("datetime", "2020-05-11");
			});

			it("should render pageheader meta expected publication date TBC", async () => {
				props = (
					(await getServerSideProps({
						...getServerSidePropsContext,
						params: {
							slug: "gid-ta11036",
						},
						resolvedUrl: "/indicators/indevelopment/gid-ta11036",
					})) as {
						props: InDevelopmentPageProps;
					}
				).props;
				render(<InDevelopmentPage {...props} />);
				expect(
					screen.getByText("Expected publication date: TBC")
				).toBeInTheDocument();
			});

			it("should not render pageheader meta expected publication date if status = discontinued", async () => {
				props = (
					(await getServerSideProps({
						...getServerSidePropsContext,
						params: {
							slug: "gid-mt130",
						},
						resolvedUrl: "/indicators/indevelopment/gid-mt130",
					})) as {
						props: InDevelopmentPageProps;
					}
				).props;
				render(<InDevelopmentPage {...props} />);

				expect(
					screen.queryByText("Expected publication date: TBC")
				).not.toBeInTheDocument();

				expect(
					screen.queryByText("GID-MT130 ", {
						selector: ".page-header__metadata li",
					})
				).not.toBeInTheDocument();
			});

			it("should render pageheader meta discontinued if status = discontinued", async () => {
				props = (
					(await getServerSideProps({
						...getServerSidePropsContext,
						params: {
							slug: "gid-mt130",
						},
						resolvedUrl: "/indicators/indevelopment/gid-mt130",
					})) as {
						props: InDevelopmentPageProps;
					}
				).props;
				render(<InDevelopmentPage {...props} />);

				expect(
					screen.getByText("Discontinued GID-MT130", {
						selector: ".page-header__metadata li",
					})
				).toBeInTheDocument();

				expect(screen.getByText("Status: Discontinued")).toBeInTheDocument();
			});

			it("should render a 'register as a stakeholder' link", async () => {
				render(<InDevelopmentPage {...props} />);
				const stakeholderLink = screen.getByRole("link", {
					name: "Register as a stakeholder",
				});
				expect(stakeholderLink).toBeInTheDocument();
				expect(stakeholderLink).toHaveAttribute(
					"href",
					"https://alpha.nice.org.uk/get-involved/stakeholder-registration/register"
				);
			});
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
