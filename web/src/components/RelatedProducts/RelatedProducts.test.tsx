import { render, screen } from "@testing-library/react";

import { RelatedProducts, RelatedProductsProps } from "./RelatedProducts";

describe("RelatedProducts", () => {
	it("should render nothing when relatedProducts is undefined", () => {
		render(<RelatedProducts />);
		expect(
			screen.queryByText("Related quality standards")
		).not.toBeInTheDocument();
	});

	it("should render nothing when relatedProducts is an empty array", () => {
		render(<RelatedProducts relatedProducts={[]} />);
		expect(
			screen.queryByText("Related quality standards")
		).not.toBeInTheDocument();
	});

	it("should render the related products when provided", () => {
		const relatedProducts: RelatedProductsProps["relatedProducts"] = [
			{
				id: "QS1",
				title: "Product 1",
				url: "/product-1",
				relationship: "IsTheBasisOf",
				shortTitle: "Prod 1",
			},
			{
				id: "QS2",
				title: "Product 2",
				url: "/product-2",
				relationship: "IsTheBasisOf",
				shortTitle: "Prod 2",
			},
		];

		render(<RelatedProducts relatedProducts={relatedProducts} />);

		expect(screen.getByText("Related quality standards")).toBeInTheDocument();
		expect(screen.getByText("Product 1")).toBeInTheDocument();
		expect(screen.getByText("Product 2")).toBeInTheDocument();
		expect(screen.getByText("Product 1")).toHaveAttribute(
			"href",
			"/guidance/qs1"
		);
		expect(screen.getByText("Product 2")).toHaveAttribute(
			"href",
			"/guidance/qs2"
		);
	});

	it("should render a horizontal rule between related products", () => {
		const relatedProducts: RelatedProductsProps["relatedProducts"] = [
			{
				id: "QS1",
				title: "Product 1",
				url: "/product-1",
				relationship: "IsTheBasisOf",
				shortTitle: "Prod 1",
			},
			{
				id: "QS2",
				title: "Product 2",
				url: "/product-2",
				relationship: "IsTheBasisOf",
				shortTitle: "Prod 2",
			},
		];

		render(<RelatedProducts relatedProducts={relatedProducts} />);

		const hrElements = screen.getAllByRole("separator");
		expect(hrElements).toHaveLength(1); // Only one separator between two items
	});

	it("should not render a horizontal rule if there is only one related product", () => {
		const relatedProducts: RelatedProductsProps["relatedProducts"] = [
			{
				id: "QS1",
				title: "Product 1",
				url: "/product-1",
				relationship: "IsTheBasisOf",
				shortTitle: "Prod 1",
			},
		];

		render(<RelatedProducts relatedProducts={relatedProducts} />);

		expect(screen.queryByRole("separator")).not.toBeInTheDocument();
	});
});
