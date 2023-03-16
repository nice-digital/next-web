import { render, screen } from "@testing-library/react";

import { ProjectStatus } from "@/feeds/inDev/types";

import { InDevProjectCard } from "./InDevProjectCard";

type Project = Parameters<typeof InDevProjectCard>[0]["project"];

describe("InDevProjectCard", () => {
	it("should render project title", () => {
		render(
			<InDevProjectCard
				project={{ title: "Test title", reference: "" } as unknown as Project}
			/>
		);

		expect(screen.getByText("Test title")).toBeInTheDocument();
	});

	it("should render data element with GID value around project title", () => {
		render(
			<InDevProjectCard
				project={
					{ title: "Test title", reference: "GID-ABC123" } as unknown as Project
				}
			/>
		);

		expect(
			screen.getByText("Test title", { selector: "data" })
		).toHaveAttribute("value", "GID-ABC123");
	});

	it("should render project title as link to project", () => {
		render(
			<InDevProjectCard
				project={
					{ title: "Test title", reference: "GID-ABC123" } as unknown as Project
				}
			/>
		);

		expect(screen.getByRole("link", { name: "Test title" })).toHaveAttribute(
			"href",
			"/indicators/indevelopment/gid-abc123"
		);
	});

	it("should render product type metadata", () => {
		render(
			<InDevProjectCard
				project={
					{
						title: "Test title",
						reference: "GID-ABC123",
						productTypeName: "Test product type",
					} as unknown as Project
				}
			/>
		);

		expect(screen.getByText("Product type:").tagName).toBe("DT");
		expect(screen.getByText("Test product type").tagName).toBe("DD");
	});

	it("should render expected publication date metadata for TBC date with non-proposed guidance", () => {
		render(
			<InDevProjectCard
				project={
					{
						title: "Test title",
						reference: "GID-ABC123",
						productTypeName: "Test product type",
						publishedDate: null,
					} as unknown as Project
				}
			/>
		);

		expect(screen.getByText("Expected publication date:").tagName).toBe("DT");
		expect(screen.getByText("TBC").tagName).toBe("ABBR");
		expect(screen.getByText("TBC")).toHaveAttribute("title", "To be confirmed");
	});

	it("should render expected publication date metadata as time tag with correct formatted date with non-proposed guidance", () => {
		render(
			<InDevProjectCard
				project={
					{
						title: "Test title",
						reference: "GID-ABC123",
						productTypeName: "Test product type",
						publishedDate: "2020-12-31",
					} as unknown as Project
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

	it("should not render expected publication date for proposed guidance", () => {
		render(
			<InDevProjectCard
				project={
					{
						reference: "GID-ABC123",
						status: ProjectStatus.Proposed,
					} as unknown as Project
				}
			/>
		);

		expect(screen.queryByText("Expected publication date:")).toBeNull();
	});
});
