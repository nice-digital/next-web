import { render, screen } from "@testing-library/react";

import {
	ProjectPageHeading,
	ProjectPageHeadingProps,
} from "./ProjectPageHeading";

const props: ProjectPageHeadingProps = {
	projectType: "TA",
	reference: "GID-TAG377",
	status: "Discontinued",
	title: "Adrenal insufficiency: acute and long-term management",
	indevScheduleItems: [],
	indevStakeholderRegistration: [
		{
			href: "https://alpha.nice.org.uk/get-involved/stakeholder-registration/register",
		},
	],
};

describe("ProjectPageHeading", () => {
	it("should render a project information overview heading h1", () => {
		render(<ProjectPageHeading {...props} />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: "Adrenal insufficiency: acute and long-term management",
			})
		).toBeInTheDocument();
	});

	it("should not render a 'Register an interest' link if project status is discontinued or project type is not 'IPG'", async () => {
		render(<ProjectPageHeading {...props} />);
		const registerAnInterestLink = screen.queryByRole("link", {
			name: "Register an interest",
		});

		expect(registerAnInterestLink).toBeFalsy();
	});

	it("should render pageheader meta expected publication date TBC when status is not discontinued", async () => {
		const mockProps = {
			...props,
			status: "InProgress",
		};

		render(<ProjectPageHeading {...mockProps} />);
		expect(
			screen.getByText("Expected publication date: TBC")
		).toBeInTheDocument();
	});

	it("should not render pageheader meta expected publication date if status = discontinued", async () => {
		render(<ProjectPageHeading {...props} />);
		expect(
			screen.queryByText("Expected publication date: TBC")
		).not.toBeInTheDocument();

		expect(
			screen.queryByText("GID-TAG377 ", {
				selector: ".page-header__metadata li",
			})
		).not.toBeInTheDocument();
	});

	it("should render pageheader meta discontinued if status = discontinued", async () => {
		const mockProps = {
			...props,
			status: "Discontinued",
		};
		render(<ProjectPageHeading {...mockProps} />);

		expect(
			screen.getByText("Discontinued GID-TAG377", {
				selector: ".page-header__metadata li",
			})
		).toBeInTheDocument();
	});

	it("should render a 'Register an interest' link if the project type is 'IPG' or project status is not 'Discontinued'", async () => {
		const mockProps = {
			...props,
			projectType: "IPG",
			reference: "GID-IPG10305",
			status: "InProgress",
		};
		render(<ProjectPageHeading {...mockProps} />);

		const registerAnInterestLink = screen.getByRole("link", {
			name: "Register an interest",
		});

		expect(registerAnInterestLink).toBeInTheDocument();

		expect(registerAnInterestLink).toHaveAttribute(
			"href",
			"/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=GID-IPG10305&returnUrl=/guidance/indevelopment/GID-IPG10305"
		);
	});

	it("should render a 'register as a stakeholder' link", async () => {
		render(<ProjectPageHeading {...props} />);
		const stakeholderLink = screen.getByRole("link", {
			name: "Register as a stakeholder",
		});
		expect(stakeholderLink).toBeInTheDocument();
		expect(stakeholderLink).toHaveAttribute(
			"href",
			"https://alpha.nice.org.uk/get-involved/stakeholder-registration/register?t=&p=GID-TAG377&returnUrl=/guidance/indevelopment/GID-TAG377"
		);
	});
});
