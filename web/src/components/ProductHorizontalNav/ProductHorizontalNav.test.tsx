import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import {
	ProductHorizontalNav,
	type ProductHorizontalNavProps,
} from "./ProductHorizontalNav";

const props: ProductHorizontalNavProps = {
	productTypeName: "Indicator",
	productPath: "/indicators/ind1-test",
	hasEvidenceResources: true,
	hasHistory: true,
	hasInfoForPublicResources: true,
	hasToolsAndResources: true,
};

const useRouterMock = jest.mocked(useRouter);

describe("ProductHorizontalNav", () => {
	beforeEach(() => {
		useRouterMock.mockReturnValue({
			asPath: props.productPath,
		} as ReturnType<typeof useRouter>);
	});

	it("should match snapshot for all nav items", () => {
		const { container } = render(<ProductHorizontalNav {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("should use product type name for overview nav link", () => {
		render(<ProductHorizontalNav {...props} />);
		expect(screen.getByRole("link", { name: "Indicator" })).toBeInTheDocument();
	});

	it("should highlight overview nav link when on the overview page", () => {
		render(<ProductHorizontalNav {...props} />);
		expect(screen.getByRole("link", { name: "Indicator" })).toHaveAttribute(
			"aria-current",
			"true"
		);
	});

	it("should render nothing when there are no resources, IFP, evidence or history", () => {
		render(
			<ProductHorizontalNav
				{...props}
				hasEvidenceResources={false}
				hasHistory={false}
				hasInfoForPublicResources={false}
				hasToolsAndResources={false}
			/>
		);

		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it.each([
		["Evidence", "hasEvidenceResources"],
		["History", "hasHistory"],
		["Information for the public", "hasInfoForPublicResources"],
		["Tools and resources", "hasToolsAndResources"],
	])("should hide %s link when no content", (text, propName) => {
		const newProps = { ...props, [propName]: false };

		render(<ProductHorizontalNav {...newProps} />);

		expect(screen.queryByRole("link", { name: text })).toBeNull();
	});

	it.each([
		["Evidence", "evidence"],
		["History", "history"],
		["Information for the public", "informationforpublic"],
		["Tools and resources", "resources"],
	])("should highlight %s link when exact match on path", (name, pathSlug) => {
		useRouterMock.mockReturnValue({
			asPath: `${props.productPath}/${pathSlug}`,
		} as ReturnType<typeof useRouter>);

		render(<ProductHorizontalNav {...props} />);

		expect(screen.getByRole("link", { name })).toHaveAttribute(
			"aria-current",
			"true"
		);
	});

	it.each([
		["Evidence", "evidence"],
		["History", "history"],
		["Information for the public", "informationforpublic"],
		["Tools and resources", "resources"],
	])("should highlight %s link for sub pages", (name, pathSlug) => {
		useRouterMock.mockReturnValue({
			asPath: `${props.productPath}/${pathSlug}/sub-page`,
		} as ReturnType<typeof useRouter>);

		render(<ProductHorizontalNav {...props} />);

		expect(screen.getByRole("link", { name })).toHaveAttribute(
			"aria-current",
			"true"
		);
	});
});
