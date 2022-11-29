import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { ResourceTypeSlug } from "@/utils/resource";

import {
	ProductResourcePage,
	type ProductResourcePageProps,
} from "./ProductResourcePage";

(useRouter as jest.Mock).mockReturnValue({
	route: "/",
	pathname: "/indicators/ind101-product-title/resources/some-resource",
	query: "",
	asPath: "/indicators/ind101-product-title/resources/some-resource",
	push: jest.fn(),
	events: {
		on: jest.fn(),
		off: jest.fn(),
	},
	beforePopState: jest.fn(() => null),
	prefetch: jest.fn(() => null),
});

describe("ProductResourcePage", () => {
	const props: ProductResourcePageProps = {
		chapters: [],
		hasEvidenceResources: true,
		hasHistory: true,
		hasInfoForPublicResources: false,
		hasToolsAndResources: true,
		htmlBody: "<p>Some body text</p>",
		lastUpdated: "2022-03-30T08:31:00",
		product: {
			id: "IND101",
			lastMajorModificationDate: "2022-04-30T08:31:00",
			productTypeName: "Indicators",
			publishedDate: "2022-04-30T08:31:00",
			title: "Product title",
		},
		productPath: "/indicators/ind101-product-title",
		resourceTypeSlug: ResourceTypeSlug.ToolsAndResources,
		title: "Resource title",
		resourceDownloadPath: "/some-download-url.pdf",
		resourceDownloadSizeBytes: 1234,
	};

	it("should match snapshot", () => {
		const { container } = render(<ProductResourcePage {...props} />);

		expect(container).toMatchSnapshot();
	});

	it.each([
		[ResourceTypeSlug.ToolsAndResources, "Tools and resources"],
		[ResourceTypeSlug.Evidence, "Evidence"],
		[ResourceTypeSlug.InformationForThePublic, "Information for the public"],
	])(
		"should set page title to be resource title and parent section title",
		(resourceTypeSlug, expectedTitleSegment) => {
			render(
				<ProductResourcePage {...props} resourceTypeSlug={resourceTypeSlug} />
			);

			expect(document.title).toBe(
				`Resource title | ${expectedTitleSegment} | IND101 | Indicators | Standards and Indicators`
			);
		}
	);

	it("should render resource title as heading 2", () => {
		render(<ProductResourcePage {...props} />);

		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"Resource title"
		);
	});

	it("should render link to resource PDF", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByRole("link", { name: "Download (PDF, 1 kB)" })
		).toHaveAttribute("href", props.resourceDownloadPath);
	});

	it("should render resource body", () => {
		render(<ProductResourcePage {...props} />);

		expect(screen.getByText("Some body text")).toBeInTheDocument();
	});

	it("should render last updated date", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByText(
				(_c, el) =>
					el?.textContent === "This page was last updated on 30 March 2022"
			)
		).toBeInTheDocument();
	});

	it("should render when the page last updated date", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByText(
				(_c, el) =>
					el?.textContent === "This page was last updated on 30 March 2022"
			)
		).toBeInTheDocument();
	});

	it("should render last updated date in time tag with ISO date time attribute", () => {
		render(<ProductResourcePage {...props} />);

		const time = screen.getByText("30 March 2022");

		expect(time).toHaveProperty("tagName", "TIME");
		expect(time).toHaveAttribute("datetime", "2022-03-30");
	});
});
