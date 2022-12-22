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

		it("should render the project description", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ipg10248",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ipg10248",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(
				screen.getByText(
					/description: the aim of intramuscular diaphragm stimulation is to make the diaphragm contract, strengthening it and allowing full or partial weaning from mechanical ventilation\. this procedure needs intact phrenic nerve function and avoids the need to access the phrenic nerve through the neck or thorax, as well as reducing the risk of phrenic nerve damage\. the procedure is done laparoscopically with the patient under general anaesthesia\. a probe is used to identify areas of the diaphragm where minimal electrical stimulation causes maximal diaphragm contraction \(known as the 'motor points'\)\. two intramuscular electrodes are implanted on the abdominal surface of each hemi-diaphragm at the motor points\. the electrode leads are tunnelled subcutaneously to an exit site in the chest where they are connected to an external battery-powered pulse generator\. a reference electrode \(anode\) is also implanted and the leads tunnelled with the other electrodes\. intraoperative stimulation and voltage calibration tests are done to confirm adequate contraction of the diaphragm\. after implantation the patient has a diaphragm conditioning programme, which involves progressive use of the system for increasing periods of time with gradual weaning from the ventilator\./i
				)
			).toBeInTheDocument();
		});

		it("should render the project id number", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-hst10009",
					},
					resolvedUrl: "/indicators/indevelopment/gid-hst10009",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);
			expect(screen.getByText("ID number: 927")).toBeInTheDocument();
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

		it("should render 'register an interest in this interventional procedure' link when projectType starts 'IPG' ", async () => {
			// gid-ip1046
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

		it("should render consultee stakeholder items", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-hst10037",
					},
					resolvedUrl: "/indicators/indevelopment/gid-hst10037",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(
				screen.getByRole("heading", { level: 3, name: "Stakeholders" })
			).toBeInTheDocument();

			const consulteeList = screen.getByLabelText("Consultee stakeholders");
			const { getAllByRole } = within(consulteeList);
			const consulteeListItems = getAllByRole("definition");
			expect(consulteeListItems.length).toBe(44);
		});

		it("should render commentator stakeholder items", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-hst10037",
					},
					resolvedUrl: "/indicators/indevelopment/gid-hst10037",
				})) as {
					props: InDevelopmentPageProps;
				}
			).props;
			render(<InDevelopmentPage {...props} />);

			expect(
				screen.getByRole("heading", { level: 3, name: "Stakeholders" })
			).toBeInTheDocument();

			const commentatorList = screen.getByLabelText("Commentator stakeholders");
			const { getAllByRole } = within(commentatorList);
			const commentatorListItems = getAllByRole("definition");
			expect(commentatorListItems.length).toBe(30);
		});

		it("should render legacy stakeholder items", async () => {
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

			const legacyStakeholderList = screen.getAllByRole("list", {
				name: "Legacy stakeholders",
			});

			expect(legacyStakeholderList).toMatchSnapshot();

			expect(
				screen.getByRole("heading", { level: 3, name: "Stakeholders" })
			).toBeInTheDocument();
		});

		it("should render suspend discontinued reason", async () => {
			props = (
				(await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ip1153",
					},
					resolvedUrl: "/indicators/indevelopment/gid-ip1153",
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
			expect(getByText("18 January 2023").tagName).toBe("DD");
		});

		it.todo("should render timeline");

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
