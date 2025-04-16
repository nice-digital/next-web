import { render, screen } from "@testing-library/react";

import { slugify } from "@/utils/url";

import { LogosList, type LogosListProps } from "./LogosList";

describe("Author Logos", () => {
	const defaultProps: LogosListProps = {
		logosList: [
			{
				name: "Test Logo1",
				url: "https://www.example1.org.uk/",
				logo: {
					url: "/organisation/NICEORG064/Logo/Normal",
				},
			},
			{
				name: "Test Logo2",
				url: "https://www.example2.org.uk",
				logo: {
					url: "/organisation/NICEORG083/Logo/Normal",
				},
			},
			{
				name: "Test Logo3",
				url: "https://www.example3.org.uk",
				logo: {
					url: "/organisation/NICEORG170/Logo/Normal",
				},
			},
		],
		productId: "PR1",
		logoType: "author",
	};

	it("should render an image for each author", () => {
		render(
			<LogosList
				logosList={defaultProps.logosList}
				productId={defaultProps.productId}
				logoType="author"
			/>
		);
		const images = screen.getAllByRole("img");
		expect(images).toHaveLength(defaultProps.logosList.length);

		images.forEach((img, index) => {
			expect(img).toHaveAttribute(
				"src",
				`/api/indicators/${defaultProps.productId}/${
					defaultProps.logoType
				}/${slugify(defaultProps.logosList[index].name)}`
			);
			expect(img).toHaveAttribute("alt", defaultProps.logosList[index].name);
		});
	});

	it("should not render any image for product without author list", () => {
		render(<LogosList logosList={[]} productId="pmg20" logoType="author" />);
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});
});

describe("Accreditation Logos", () => {
	const defaultProps: LogosListProps = {
		logosList: [
			{
				name: "Test Logo4",
				url: "https://www.example4.org.uk",
				logo: {
					url: "/organisation/NICEORG018/AccreditLogo/Normal",
				},
			},
		],
		productId: "PR2",
		logoType: "accreditation",
	};

	it("should render an image for each accreditation", () => {
		render(
			<LogosList
				logosList={defaultProps.logosList}
				productId={defaultProps.productId}
				logoType="accreditation"
			/>
		);
		const images = screen.getAllByRole("img");
		expect(images).toHaveLength(defaultProps.logosList.length);

		images.forEach((img, index) => {
			expect(img).toHaveAttribute(
				"src",
				`/api/indicators/${defaultProps.productId}/${
					defaultProps.logoType
				}/${slugify(defaultProps.logosList[index].name)}`
			);
			expect(img).toHaveAttribute("alt", defaultProps.logosList[index].name);
		});
	});

	it("should not render any image for product without accreditation", () => {
		render(
			<LogosList logosList={[]} productId="pmg20" logoType="accreditation" />
		);
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});
});
