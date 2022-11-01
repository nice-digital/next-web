import { render, screen } from "@testing-library/react";

// import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

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
			screen.getByRole("button", { name: "Download indicator PDF file" })
		).toBeInTheDocument();
	});

	it("should have a populated aria-label attribute", () => {
		render(
			<PublicationsDownloadLink
				downloadLink="/test"
				ariaLabel="Download indicator PDF file"
			/>
		);
		expect(screen.getByRole("button")).toHaveAttribute(
			"aria-label",
			"Download indicator PDF file"
		);
	});

	it("should have ([filetype]) appended to the button text", () => {
		render(
			<PublicationsDownloadLink
				downloadLink="/test"
				ariaLabel="Download indicator PDF file"
			/>
		);
		expect(screen.getByRole("button")).toHaveTextContent(
			"Download indicator (PDF)"
		);
	});
});
