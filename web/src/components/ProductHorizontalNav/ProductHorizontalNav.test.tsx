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
				hasToolsAndResources={false}
				hasInfoForPublicResources={false}
				hasEvidenceResources={false}
				hasHistory={false}
			/>
		);

		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it.each([
		["Tools and resources", "hasToolsAndResources"],
		["Information for the public", "hasInfoForPublicResources"],
		["Evidence", "hasEvidenceResources"],
		["History", "hasHistory"],
	])("should hide %s link when no content", (name, propName) => {
		const newProps = { ...props, [propName]: false };

		render(<ProductHorizontalNav {...newProps} />);

		expect(screen.queryByRole("link", { name })).toBeNull();
	});

	it.each([
		["Tools and resources", "resources"],
		["Information for the public", "information-for-the-public"],
		["Evidence", "evidence"],
		["History", "history"],
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
		["Tools and resources", "resources"],
		["Information for the public", "information-for-the-public"],
		["Evidence", "evidence"],
		["History", "history"],
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
