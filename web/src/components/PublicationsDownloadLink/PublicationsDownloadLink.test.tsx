import { render, screen } from "@testing-library/react";

import { PublicationsDownloadLink } from "./PublicationsDownloadLink";

describe("PublicationsDownloadLink", () => {
	it.only("should render a button with an aria-label", () => {
		render(
			<PublicationsDownloadLink
				downloadLink="/test"
				ariaLabel="Download indicator PDF file"
			/>
		);

		expect(
			screen.getByRole("button", { name: "Download indicator PDF file" })
		).toBeInTheDocument();
	});
});
