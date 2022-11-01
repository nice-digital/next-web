import { render, screen } from "@testing-library/react";

import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import { PublicationsDownloadLink } from "./PublicationsDownloadLink";

// `${product.embedded.nicePublicationsContentPartList.embedded.nicePublicationsUploadAndConvertContentPart.embedded.nicePublicationsPdfFile.links.self[0].href}`

// const downloadLink = mockProduct._embedded["nice.publications:content-part-list"]._embedded["nice.publications:upload-and-convert-content-part"]._embedded["nice.publications:pdf-file"]

// axios mock /feeds/product/
// const product = getProductDetails from publications
// getDownloadPath(product)
// expect..
//

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

	it("should have '(file extension)' appended to the button text", () => {
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
