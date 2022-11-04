import { render, screen } from "@testing-library/react";
import React from "react";

import { PublicationsDownloadLink } from "./PublicationsDownloadLink";

describe("PublicationsDownloadLink", () => {
	it("should render a download link button", () => {
		render(
			<PublicationsDownloadLink
				downloadLink="/test"
				ariaLabel="Download indicator PDF file"
			/>
		);

		expect(
			screen.getByRole("link", { name: "Download indicator PDF file" })
		).toBeInTheDocument();
	});

	it("should open in a new tab/window", () => {
		render(<PublicationsDownloadLink downloadLink="/test" />);

		expect(
			screen.getByRole("link", { name: "Download (PDF)" })
		).toHaveAttribute("target", "_blank");
	});

	it("should have a populated aria-label attribute", () => {
		render(
			<PublicationsDownloadLink
				downloadLink="/test"
				ariaLabel="Download indicator PDF file"
			/>
		);
		expect(screen.getByRole("link")).toHaveAttribute(
			"aria-label",
			"Download indicator PDF file"
		);
	});

	it("should have '(file extension)' appended to the default button text", () => {
		render(<PublicationsDownloadLink downloadLink="/test" />);
		expect(screen.getByRole("link")).toHaveTextContent("Download (PDF)");
	});

	it("should have '(file extension)' appended to the button text", () => {
		render(
			<PublicationsDownloadLink downloadLink="/test">
				Download guidance
			</PublicationsDownloadLink>
		);
		expect(screen.getByRole("link")).toHaveTextContent(
			"Download guidance (PDF)"
		);
	});
});
