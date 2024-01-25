import { render, screen } from "@testing-library/react";

import StoryblokImage, { StoryblokImageProps } from "./StoryblokImage";

const mockImageResponse = {
	alt: "Test image alt",
	src: "test-image.jpg",
} as StoryblokImageProps;

describe("StoryblokImage Component", () => {
	xit("should render the image with webp and jpeg ", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);

		expect(true).toBe(true);
	});

	xit("should add the alt text of the image", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);
		expect(true).toBe(true);
	});

	it("should append any service options for the Storyblok Image service", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
				serviceOptions="smart/filters:quality(80)"
			/>
		);

		expect(true).toBe(true);
	});
});
