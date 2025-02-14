import { render, screen } from "@testing-library/react";
import Image from "next/image";

import { Testimonial } from "./Testimonial";

describe("testimonial component", () => {
	it("should render with props passed", () => {
		render(
			<Testimonial
				variant="fullWidthWhite"
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
			/>
		);
		expect(screen.getByText("Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("Software Engineer")).toBeInTheDocument();
		expect(
			screen.getByText(
				"This is an amazing product! Highly recommended for everyone."
			)
		).toBeInTheDocument();
	});
	it.each<["default" | "transparent" | "fullWidth" | "fullWidthWhite", string]>(
		[
			["fullWidth", "testimonial testimonial--full-width"],
			["fullWidthWhite", "testimonial testimonial--full-width-white"],
			["default", "testimonial testimonial--default"],
			["transparent", " testimonial testimonial--transparent"],
		]
	)("Should render div with className '%s'", (variant, expectedClassName) => {
		render(
			<Testimonial
				variant={variant}
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
			/>
		);
		expect(screen.getByTestId(`testimonial-${variant}`)).toHaveClass(
			expectedClassName
		);
	});
	it("Should render default variant when variant prop is not set", () => {
		render(
			<Testimonial
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
			/>
		);
		expect(screen.getByTestId(`testimonial-default`)).toHaveClass(
			"testimonial testimonial--default"
		);
	});
	it.only("Should render image", () => {
		render(
			<Testimonial
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
				image={<Image src="http://test_image.jpeg" alt="test_image_alt" width={100} height={100}/>}
			/>
		);
		const images = screen.getAllByRole("img", { name: "test_image_alt" });
		expect(images).toHaveLength(2);
		expect(images[0]).toHaveAttribute("src", "/_next/image?url=http%3A%2F%2Ftest_image.jpeg&w=256&q=75");
	});
});
