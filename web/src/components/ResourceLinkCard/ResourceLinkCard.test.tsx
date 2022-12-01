import { render, screen } from "@testing-library/react";

import {
	ResourceLinkCard,
	type ResourceLinkCardProps,
} from "./ResourceLinkCard";

describe("ResourceLinkCard", () => {
	const externalLink: ResourceLinkCardProps["resourceLink"] = {
		href: "https://external.com",
		title: "External link",
		type: "Implementation support",
		date: "2022-07-26T18:36:26.3364957",
	};

	const fileLink: ResourceLinkCardProps["resourceLink"] = {
		href: "/something.xls",
		title: "File link",
		type: "Implementation support",
		fileSize: 12345,
		fileTypeName: "Excel",
		date: "2022-07-26T18:36:26.3364957",
	};

	it("should match snapshot for file download", () => {
		const { container } = render(<ResourceLinkCard resourceLink={fileLink} />);

		expect(container).toMatchSnapshot();
	});

	it("should use title as anchor text", () => {
		render(<ResourceLinkCard resourceLink={externalLink} />);

		expect(screen.getByRole("link")).toHaveTextContent(externalLink.title);
	});

	it("should use href as anchor href", () => {
		render(<ResourceLinkCard resourceLink={externalLink} />);

		expect(screen.getByRole("link")).toHaveAttribute("href", externalLink.href);
	});

	it("should render formatted date in time tag", () => {
		render(<ResourceLinkCard resourceLink={externalLink} />);

		const date = screen.getByText("26 July 2022", { selector: "time" });

		expect(date).toHaveAttribute("datetime", "2022-07-26");
	});

	it("should append file type and size after title for file download", () => {
		render(<ResourceLinkCard resourceLink={fileLink} />);

		expect(screen.getByRole("link")).toHaveTextContent(
			"File link (Excel, 12 kB)"
		);
	});
});
