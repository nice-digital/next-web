import { getDefaultNormalizer, render, screen } from "@testing-library/react";

import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "./ProductPageHeading";

const props: ProductPageHeadingProps = {
	product: {
		id: "ABC123",
		productTypeName: "NICE product",
		title: "Product title",
		lastMajorModificationDate: "2020-10-12T00:00:00",
		publishedDate: "2018-07-11T00:00:00",
	},
};

describe("ProductPageHeading", () => {
	it("should match snapshot", () => {
		const { container } = render(<ProductPageHeading {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("should render title as heading 1", () => {
		render(<ProductPageHeading {...props} />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Product title"
		);
	});

	it("should use alternative heading style for heading 1", () => {
		render(<ProductPageHeading {...props} />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
			"page-header__heading page-header__heading--alt"
		);
	});

	it("should render product type meta data", () => {
		render(<ProductPageHeading {...props} />);

		expect(
			screen.getByText("NICE product", {
				selector: ".page-header__metadata li",
			})
		).toBeInTheDocument();
	});

	it.each([
		["NICE product"],
		["ABC123"],
		["Published: 11 July 2018"],
		["Last updated: 12 October 2020"],
	])("should render a %s page header meta element", (metaContent) => {
		render(<ProductPageHeading {...props} />);

		expect(
			screen.getByText(
				(_content, element) => {
					return (
						getDefaultNormalizer()(element?.textContent as string) ==
						metaContent
					);
				},
				{
					selector: ".page-header__metadata li",
				}
			)
		);
	});

	it("should not render last updated date if published date == lastModified date", () => {
		const { rerender } = render(<ProductPageHeading {...props} />);

		expect(
			screen.getByText((_content, el) =>
				(el?.textContent || "").startsWith("Last updated:")
			)
		).toBeInTheDocument();

		rerender(
			<ProductPageHeading
				{...props}
				product={{
					...props.product,
					lastMajorModificationDate: props.product.publishedDate,
				}}
			/>
		);

		expect(
			screen.queryByText((_content, el) =>
				(el?.textContent || "").startsWith("Last updated:")
			)
		).toBeNull();
	});

	it("should render 'Published' date page header lead meta element in the correct format", () => {
		render(<ProductPageHeading {...props} />);
		const publishedDateEl = screen.getByText("11 July 2018", {
			selector: "time",
		});
		expect(publishedDateEl).toBeInTheDocument();
	});

	it("should render 'Published' date page header lead meta element with correctly formatted datetime attribute", () => {
		render(<ProductPageHeading {...props} />);
		const publishedDateEl = screen.getByText("11 July 2018", {
			selector: "time",
		});
		expect(publishedDateEl).toHaveAttribute("datetime", "2018-07-11");
	});

	it("should render 'Last updated' date page header lead meta element in the correct format", () => {
		render(
			<ProductPageHeading
				{...props}
				product={{
					...props.product,
					lastMajorModificationDate: "2022-10-12",
				}}
			/>
		);
		const publishedDateEl = screen.getByText("12 October 2022", {
			selector: "time",
		});
		expect(publishedDateEl).toBeInTheDocument();
	});

	it("should render 'Last updated' date page header lead meta element with correctly formatted datetime attribute", () => {
		render(
			<ProductPageHeading
				{...props}
				product={{
					...props.product,
					lastMajorModificationDate: "2022-11-11T11:17:45.442351",
				}}
			/>
		);
		const publishedDateEl = screen.getByText("11 November 2022", {
			selector: "time",
		});
		expect(publishedDateEl).toHaveAttribute("datetime", "2022-11-11");
	});
});
