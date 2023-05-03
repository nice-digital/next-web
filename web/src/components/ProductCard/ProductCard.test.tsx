import { render, screen } from "@testing-library/react";

import { ProductGroup } from "@/feeds/publications/types";

import { ProductCard } from "./ProductCard";

type Product = Parameters<typeof ProductCard>[0]["product"];

const mockProduct: Product = {
	title: "Test title",
	id: "NG123",
	productGroup: ProductGroup.Guidance,
	lastMajorModificationDate: "2020-12-31",
} as Product;

describe("ProductCard", () => {
	it("should render product title", () => {
		render(<ProductCard product={mockProduct} />);

		expect(screen.getByText("Test title (NG123)")).toBeInTheDocument();
	});

	it("should render data element with ID value around product title", () => {
		render(<ProductCard product={mockProduct} />);

		expect(
			screen.getByText("Test title (NG123)", { selector: "data" })
		).toHaveAttribute("value", "NG123");
	});

	it("should render product title as link to product", () => {
		render(<ProductCard product={mockProduct} />);

		// Note: \xa0 below is because of https://github.com/testing-library/dom-testing-library/issues/904
		expect(
			screen.getByRole("link", { name: "Test title\xa0(NG123)" })
		).toHaveAttribute("href", "/guidance/ng123");
	});

	it("should render product group metadata", () => {
		render(
			<ProductCard product={mockProduct} productTypeName="Test product type" />
		);

		expect(screen.getByText("Programme:").tagName).toBe("DT");
		expect(screen.getByText("Guidance").tagName).toBe("DD");
	});

	it("should render programme metadata", () => {
		render(
			<ProductCard product={mockProduct} productTypeName="Test product type" />
		);

		expect(screen.getByText("Product type:").tagName).toBe("DT");
		expect(screen.getByText("Test product type").tagName).toBe("DD");
	});

	it("should render last major modified date metadata as time tag with correct formatted date", () => {
		render(
			<ProductCard product={mockProduct} productTypeName="Test product type" />
		);

		expect(screen.getByText("Last updated:").tagName).toBe("DT");
		expect(screen.getByText("31 December 2020").tagName).toBe("TIME");
		expect(screen.getByText("31 December 2020")).toHaveAttribute(
			"datetime",
			"2020-12-31"
		);
	});
});
