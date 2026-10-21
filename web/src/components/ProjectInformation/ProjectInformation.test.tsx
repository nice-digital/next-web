import { render, screen, within } from "@testing-library/react";

import { PrioritisationReason } from "@/feeds/inDev/types";

import {
	ProjectInformation,
	ProjectInformationProps,
} from "./ProjectInformation";

const props: ProjectInformationProps = {
	consultationUrls: [
		"/indicators/indevelopment/gid-ipg10316/consultations/html-content-4",
		"/indicators/indevelopment/gid-ipg10316/consultations/html-content-2",
		"/indicators/indevelopment/gid-ipg10316/consultations/html-content",
	],
	description: "test description",
	idNumber: "42",
	process: "APG",
	projectType: "project type",
	referralDate: "February 2010",
	status: "status",
	summary: "summary text",
	suspendDiscontinuedReason: "some reason",
	suspendDiscontinuedUrl: "suspend url",
	suspendDiscontinuedUrlText: "suspend disontinued text",
	technologyType: "tech type",
	routingDecision: null,
	routingDecisionPublicationDate: null,
	routingDecisionRationale: null,
	prioritisationDecision: "Prioritised",
	prioritisationReason: "Prioritisation reason",
	prioritisationProgramme: "HealthTech",
	prioritisationBoardDecisionDate: "2026-07-21T00:00:00",
	prioritisationRationale: "Prioritisation rationale",
	reference: "",
	title: "",
	isGuidanceHubPage: false,
	content: null,
};

describe("ProjectInformation", () => {
	it("should render the project description", async () => {
		render(<ProjectInformation {...props} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Description:").tagName).toBe("DT");
		expect(getByText("test description").tagName).toBe("DD");
	});

	it("should render the project id number", async () => {
		render(<ProjectInformation {...props} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("ID number:").tagName).toBe("DT");
		expect(getByText("42").tagName).toBe("DD");
	});

	it.each([
		["Monitor", PrioritisationReason.Monitor],
		["Anticipate", PrioritisationReason.Anticipate],
		["NotEligible", PrioritisationReason.NotEligible],
		["FurtherDiscussion", PrioritisationReason.FurtherDiscussion],
	])(
		"should render text when a topic selection reason %s exists, topic reason text: %s",
		(prioritisationReason, prioritisationReasonText) => {
			const mockProps = { ...props, prioritisationReason };
			render(<ProjectInformation {...mockProps} />);

			const list = screen.getByLabelText("Project information");
			const { getByText } = within(list);
			expect(getByText("Reason for prioritisation decision:").tagName).toBe(
				"DT"
			);
			expect(getByText(`${prioritisationReasonText}`).tagName).toBe("DD");
		}
	);

	it("should render 'Developed as: [Process]' when status != TopicSelection and ProjectType='NG' ", async () => {
		const mockProps = { ...props, status: "InProgress", projectType: "NG" };
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Developed as:").tagName).toBe("DT");
		expect(getByText("APG").tagName).toBe("DD");
	});

	it("should render 'Process: [Process]' when status != TopicSelection and ProjectType != 'NG'", async () => {
		const mockProps = {
			...props,
			status: "InProgress",
			process: "HST",
			projectType: "IPG",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Process:").tagName).toBe("DT");
		expect(getByText("HST").tagName).toBe("DD");
	});

	it("should render 'Notification date' when Process =='MT' ", async () => {
		const mockProps = {
			...props,
			status: "InProgress",
			process: "MT",
			projectType: "IPG",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Process:").tagName).toBe("DT");
		expect(getByText("MT").tagName).toBe("DD");

		const list2 = screen.getByLabelText("Project information");
		const { getByText: getByText2 } = within(list2);
		expect(getByText2("Notification date:").tagName).toBe("DT");
		expect(getByText2("February 2010").tagName).toBe("DD");
	});

	it("should render 'Referral date' when Process != 'MT ", async () => {
		const mockProps = {
			...props,
			status: "Suspended",
			process: "STA pre-2018",
			projectType: "TA",
			referralDate: "November 2005",
		};
		render(<ProjectInformation {...mockProps} />);
		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Referral date:").tagName).toBe("DT");

		const dates = screen.getAllByText("1 November 2005")[0] as HTMLElement;
		expect(dates.tagName).toBe("TIME");
	});

	it("should render discontinued if status = discontinued", async () => {
		const mockProps = {
			...props,
			status: "Discontinued",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Status:").tagName).toBe("DT");
		expect(getByText("Discontinued").tagName).toBe("DD");
	});

	it("should not render routingDecision if routingDecision is null", async () => {
		const mockProps = {
			...props,
			routingDecision: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Routing decision:")).toBeNull();
	});

	it("should not render routingDecision if routingDecision is empty", async () => {
		const mockProps = {
			...props,
			routingDecision: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Routing decision:")).toBeNull();
	});

	it("should render routingDecision if routingDecision has content", async () => {
		const mockProps = {
			...props,
			routingDecision: "Routed as a TA",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Routing decision:").tagName).toBe("DT");
		expect(getByText("Routed as a TA").tagName).toBe("DD");
	});

	it("should not render routingDecisionPublicationDate if routingDecisionPublicationDate is null", async () => {
		const mockProps = {
			...props,
			routingDecisionPublicationDate: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Routing decision publication date:")
		).toBeNull();
	});

	it("should not render routingDecisionPublicationDate if routingDecisionPublicationDate is empty", async () => {
		const mockProps = {
			...props,
			routingDecisionPublicationDate: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Routing decision publication date:")
		).toBeNull();
	});

	it("should render routingDecisionPublicationDate if routingDecisionPublicationDate has content", async () => {
		const mockProps = {
			...props,
			routingDecisionPublicationDate: "2026-10-21T00:00:00",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Routing decision publication date:").tagName).toBe("DT");
		expect(getByText("21 October 2026").tagName).toBe("TIME");
	});

	it("should not render routingDecisionRationale if routingDecisionRationale is null", async () => {
		const mockProps = {
			...props,
			routingDecisionRationale: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Routing decision rationale:")).toBeNull();
	});

	it("should not render routingDecisionRationale if routingDecisionRationale is empty", async () => {
		const mockProps = {
			...props,
			routingDecisionRationale: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Routing decision rationale:")).toBeNull();
	});

	it("should render routingDecisionRationale if routingDecisionRationale has content", async () => {
		const mockProps = {
			...props,
			routingDecisionRationale: "Routing decision rationale",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Routing decision rationale:").tagName).toBe("DT");
		expect(getByText("Routing decision rationale").tagName).toBe("DD");
	});

	it("should not render prioritisationDecision if prioritisationDecision is null", async () => {
		const mockProps = {
			...props,
			prioritisationDecision: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation decision:")).toBeNull();
	});

	it("should not render prioritisationDecision if prioritisationDecision is empty", async () => {
		const mockProps = {
			...props,
			prioritisationDecision: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation decision:")).toBeNull();
	});

	it("should render prioritisationDecision if prioritisationDecision has content", async () => {
		const mockProps = {
			...props,
			prioritisationDecision: "NotPrioritised",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Prioritisation decision:").tagName).toBe("DT");
		expect(getByText("Not prioritised").tagName).toBe("DD");
	});

	it("should not render prioritisationBoardDecisionDate if prioritisationBoardDecisionDate is null", async () => {
		const mockProps = {
			...props,
			prioritisationBoardDecisionDate: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Prioritisation decision publication date:")
		).toBeNull();
	});

	it("should not render prioritisationBoardDecisionDate if prioritisationBoardDecisionDate is empty", async () => {
		const mockProps = {
			...props,
			prioritisationBoardDecisionDate: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Prioritisation decision publication date:")
		).toBeNull();
	});

	it("should render prioritisationBoardDecisionDate if prioritisationBoardDecisionDate has content", async () => {
		const mockProps = {
			...props,
			prioritisationBoardDecisionDate: "2026-07-21T00:00:00",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Prioritisation decision publication date:").tagName).toBe(
			"DT"
		);
		expect(getByText("21 July 2026").tagName).toBe("TIME");
	});

	it("should not render prioritisationProgramme if prioritisationProgramme is null", async () => {
		const mockProps = {
			...props,
			prioritisationProgramme: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation programme:")).toBeNull();
	});

	it("should not render prioritisationProgramme if prioritisationProgramme is empty", async () => {
		const mockProps = {
			...props,
			prioritisationProgramme: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation programme:")).toBeNull();
	});

	it("should render prioritisationProgramme if prioritisationProgramme has content", async () => {
		const mockProps = {
			...props,
			prioritisationProgramme: "HealthTech",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Prioritisation programme:").tagName).toBe("DT");
		expect(getByText("HealthTech").tagName).toBe("DD");
	});

	it("should not render prioritisationReason if prioritisationReason is null", async () => {
		const mockProps = {
			...props,
			prioritisationReason: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Reason for prioritisation decision:")
		).toBeNull();
	});

	it("should not render prioritisationReason if prioritisationReason is empty", async () => {
		const mockProps = {
			...props,
			prioritisationReason: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(
			within(list).queryByText("Reason for prioritisation decision:")
		).toBeNull();
	});

	it("should render prioritisationReason if prioritisationReason has content", async () => {
		const mockProps = {
			...props,
			prioritisationReason: "Monitor",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Reason for prioritisation decision:").tagName).toBe("DT");
		expect(
			getByText(
				"Monitor - awaiting publication of further literature or evidence"
			).tagName
		).toBe("DD");
	});

	it("should not render prioritisationRationale if prioritisationRationale is null", async () => {
		const mockProps = {
			...props,
			prioritisationRationale: null,
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation rationale:")).toBeNull();
	});

	it("should not render prioritisationRationale if prioritisationRationale is empty", async () => {
		const mockProps = {
			...props,
			prioritisationRationale: "",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		expect(within(list).queryByText("Prioritisation rationale:")).toBeNull();
	});

	it("should render prioritisationRationale if prioritisationRationale has content", async () => {
		const mockProps = {
			...props,
			prioritisationRationale: "Prioritisation rationale goes here",
		};
		render(<ProjectInformation {...mockProps} />);

		const list = screen.getByLabelText("Project information");
		const { getByText } = within(list);
		expect(getByText("Prioritisation decision rationale:").tagName).toBe("DT");
		expect(getByText("Prioritisation rationale goes here").tagName).toBe("DD");
	});
});
