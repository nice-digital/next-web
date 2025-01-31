/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";
import {
	TestimonialFullWidth,
	TestimonialFullWidthProps,
} from "./TestimonialFullWidth";

const mockTestimonialFullWidth: TestimonialFullWidthProps = {
	blok: {
		image: {
			id: 123456789,
			name: "Kittens mate.",
			filename: "https://placekitten.com/408/287",
			alt: null,
			fieldtype: "asset",
			title: null,
			focus: null,
		},
		quoteName: "Test Name",
		quoteRole: "Test Role",
		quoteText: "Test Quote Text",
		variant: "fullWidth",
		component: "testimonial",
		_uid: "",
	},
};

const mockTestimonialFullWidthWhite: TestimonialFullWidthProps = {
	blok: {
		...mockTestimonialFullWidth.blok,
		variant: "fullWidthWhite",
	},
};

describe("Storyblok testimonial full width component", () => {
	it("should match snapshot for full width variant", () => {
		const { container } = render(
			<TestimonialFullWidth {...mockTestimonialFullWidth} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot for the full width white variant", () => {
		const { container } = render(
			<TestimonialFullWidth {...mockTestimonialFullWidthWhite} />
		);
		expect(container).toMatchSnapshot();
	});
});
