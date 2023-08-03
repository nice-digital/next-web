import { render, screen, within } from "@testing-library/react";

import { JotFormPage, type JotFormPageProps } from "./JotFormPage";

const props: JotFormPageProps = {
	formID: "1234",
	formName: "Form title",
	height: 567,
	lead: "Some lead copy",
	parentPages: [
		{
			title: "What we do",
			path: "/about/what-we-do",
		},
		{
			title: "About",
			path: "/about",
		},
	],
};

describe("JotFormPage", () => {
	it("should render form name and parent pages in page title", () => {
		render(<JotFormPage {...props} />);

		expect(document.title).toBe("Form title | What we do | About");
	});

	it("should render home breadcrumb", () => {
		render(<JotFormPage {...props} />);

		expect(screen.getByText("Home")).toHaveAttribute("href", "/");
	});

	it("should render breadcrumbs in reverse order", () => {
		render(<JotFormPage {...props} />);

		const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });

		expect(
			within(breadcrumbs)
				.getAllByRole("link")
				.map((a) => a.textContent)
		).toStrictEqual(["Home", "About", "What we do"]);
	});

	it("should render form name as heading 1", () => {
		render(<JotFormPage {...props} />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			props.formName
		);
	});

	it("should render content start id on page header", () => {
		render(<JotFormPage {...props} />);

		const h1 = screen.getByRole("heading", { level: 1 });

		// eslint-disable-next-line testing-library/no-node-access
		expect(h1.parentNode).toHaveAttribute("id", "content-start");
	});

	it("should render iframe with form id and title", () => {
		render(<JotFormPage {...props} />);

		const iframe = screen.getByTitle(props.formName);

		expect(iframe).toHaveAttribute(
			"src",
			"https://next-web-tests.jotform.com/1234?isIframeEmbed=1"
		);
	});

	it("displays information panel when provided", () => {
		const informationPanel = <div>Information Panel Content</div>;

		render(<JotFormPage {...props} informationPanel={informationPanel} />);

		const informationPanelContent = screen.getByText(
			"Information Panel Content"
		);
		expect(informationPanelContent).toBeInTheDocument();
	});
});
