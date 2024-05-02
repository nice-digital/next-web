import { render, screen, within } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ResourceTypeSlug } from "@/utils/resource";

import {
	ProductResourcePage,
	type ProductResourcePageProps,
} from "./ProductResourcePage";
import { getGetServerSidePropsFunc } from "./ProductResourcePage.getServerSideProps";
import { type Params } from "./ProductResourcePage.getServerSideProps.test";

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

const resourceUID = 3784329,
	partUID = 4904490349,
	partSlug = `resource-impact-statement-${resourceUID}-${partUID}`,
	slug = `ng100`,
	productRoot = "guidance",
	getServerSidePropsContext = {
		params: {
			slug,
			partSlug,
		},
		query: {
			productRoot,
		},
		resolvedUrl: `/${productRoot}/${slug}/resources/${partSlug}`,
	} as unknown as GetServerSidePropsContext<Params>;

describe("ProductResourcePage", () => {
	let props: ProductResourcePageProps;

	beforeEach(async () => {
		props = (
			(await getGetServerSidePropsFunc(ResourceTypeSlug.ToolsAndResources)(
				getServerSidePropsContext
			)) as { props: ProductResourcePageProps }
		).props;
	});

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
				`Resource impact statement | ${expectedTitleSegment} | NG100 | Indicators`
			);
		}
	);

	it("should render resource title as heading 2", () => {
		render(<ProductResourcePage {...props} />);

		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"Resource impact statement"
		);
	});

	it("should render link to resource PDF", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByRole("link", { name: "Download (PDF, 40 kB)" })
		).toHaveAttribute("href", props.resourceDownloadPath);
	});

	it("should render resource body", () => {
		render(<ProductResourcePage {...props} />);

		expect(screen.getByText("Some body content")).toBeInTheDocument();
	});

	it("should render last updated date", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByText(
				(_c, el) =>
					el?.textContent === "This page was last updated on 11 July 2018"
			)
		).toBeInTheDocument();
	});

	it("should render when the page last updated date", () => {
		render(<ProductResourcePage {...props} />);

		expect(
			screen.getByText(
				(_c, el) =>
					el?.textContent === "This page was last updated on 11 July 2018"
			)
		).toBeInTheDocument();
	});

	it("should render last updated date in time tag with ISO date time attribute", () => {
		render(<ProductResourcePage {...props} />);

		const updatedMsg = screen.getByText(
			(_c, el) =>
				el?.textContent === "This page was last updated on 11 July 2018"
		);

		const time = within(updatedMsg).getByText("11 July 2018");

		expect(time).toHaveProperty("tagName", "TIME");
		expect(time).toHaveAttribute("datetime", "2018-07-11");
	});
});
