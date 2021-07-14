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

	it.todo("Metadata");
});
