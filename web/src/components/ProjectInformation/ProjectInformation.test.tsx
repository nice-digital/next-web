import { render, screen, within } from "@testing-library/react";

import { TopicSelectionReason } from "@/feeds/inDev/types";

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
	topicSelectionDecision: "topic selection decision",
	topicSelectionReason: "topic selection reason",
	topicSelectionFurtherInfo: "top selection further info",
	reference: "",
	title: "",
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
		["Monitor", TopicSelectionReason.Monitor],
		["Anticipate", TopicSelectionReason.Anticipate],
		["NotEligible", TopicSelectionReason.NotEligible],
		["FurtherDiscussion", TopicSelectionReason.FurtherDiscussion],
	])(
		"should render text when a topic selection reason %s exists, topic reason text: %s",
		(topicSelectionReason, topicSelectionReasonText) => {
			const mockProps = { ...props, topicSelectionReason };
			render(<ProjectInformation {...mockProps} />);

			const list = screen.getByLabelText("Project information");
			const { getByText } = within(list);
			expect(getByText("Reason for decision:").tagName).toBe("DT");
			expect(getByText(`${topicSelectionReasonText}`).tagName).toBe("DD");
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

	it("should reder 'Notification date' when Process =='MT' ", async () => {
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
});
