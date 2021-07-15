import { render, screen } from "@testing-library/react";

import { InDevProjectCard } from "./InDevProjectCard";

type Project = Parameters<typeof InDevProjectCard>[0]["project"];

describe("InDevProjectCard", () => {
	it("should render project title", () => {
		render(
			<InDevProjectCard
				project={{ Title: "Test title", Reference: "" } as Project}
			/>
		);

		expect(screen.getByText("Test title")).toBeInTheDocument();
	});

	it("should render data element with GID value around project title", () => {
		render(
			<InDevProjectCard
				project={{ Title: "Test title", Reference: "GID-ABC123" } as Project}
			/>
		);

		expect(
			screen.getByText("Test title", { selector: "data" })
		).toHaveAttribute("value", "GID-ABC123");
	});

	it("should render project title as link to project", () => {
		render(
			<InDevProjectCard
				project={{ Title: "Test title", Reference: "GID-ABC123" } as Project}
			/>
		);

		expect(screen.getByRole("link", { name: "Test title" })).toHaveAttribute(
			"href",
			"/guidance/indevelopment/gid-abc123"
		);
	});

	it("should render product type metadata", () => {
		render(
			<InDevProjectCard
				project={
					{
						Title: "Test title",
						Reference: "GID-ABC123",
						ProductTypeName: "Test product type",
					} as Project
				}
			/>
		);

		expect(screen.getByText("Product type:").tagName).toBe("DT");
		expect(screen.getByText("Test product type").tagName).toBe("DD");
	});

	it("should render expected publication date metadata for TBC date", () => {
		render(
			<InDevProjectCard
				project={
					{
						Title: "Test title",
						Reference: "GID-ABC123",
						ProductTypeName: "Test product type",
						PublishedDate: null,
					} as Project
				}
			/>
		);

		expect(screen.getByText("Expected publication date:").tagName).toBe("DT");
		expect(screen.getByText("TBC").tagName).toBe("ABBR");
		expect(screen.getByText("TBC")).toHaveAttribute("title", "To be confirmed");
	});

	it("should render expected publication date metadata as time tag with correct formatted date", () => {
		render(
			<InDevProjectCard
				project={
					{
						Title: "Test title",
						Reference: "GID-ABC123",
						ProductTypeName: "Test product type",
						PublishedDate: "2020-12-31",
					} as Project
				}
			/>
		);

		expect(screen.getByText("Expected publication date:").tagName).toBe("DT");
		expect(screen.getByText("31 December 2020").tagName).toBe("TIME");
		expect(screen.getByText("31 December 2020")).toHaveAttribute(
			"datetime",
			"2020-12-31"
		);
	});
});
