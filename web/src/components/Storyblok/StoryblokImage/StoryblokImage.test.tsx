import { render, screen } from "@testing-library/react";

import { StoryblokImage, StoryblokImageProps } from "./StoryblokImage";

const mockImageResponse = {
	alt: "Test image alt",
	src: "test-image.jpg",
} as StoryblokImageProps;

describe("StoryblokImage Component", () => {
	it("should render the image with webp and jpeg ", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toContain(".jpg");
		expect(imageSrc).toBe(mockImageResponse.src);
	});

	it("should add the alt text of the image", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);
		const altText = screen.getByRole("img").getAttribute("alt");
		expect(altText).toBe(mockImageResponse.alt);
	});

	it("should append any service options for the Storyblok Image service", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
				serviceOptions="smart/filters:quality(80):grayscale()"
			/>
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");
		expect(imageSrc).toContain("smart/filters:quality(80):grayscale()");
	});

	it("should add the className to the image if className passed", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
				className="test-class"
			/>
		);

		const imageClass = screen.getByRole("img").getAttribute("class");
		expect(imageClass).toContain("test-class");
	});

	it("should add the height and the width to the image if height and width passed", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
				height="100px"
				width="100px"
			/>
		);

		const imageHeight = screen.getByRole("img").getAttribute("height");
		const imageWidth = screen.getByRole("img").getAttribute("width");
		expect(imageHeight).toBe("100px");
		expect(imageWidth).toBe("100px");
	});

	it("should add other image attributes to the image if they are passed", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
				loading="lazy"
			/>
		);

		const imageLoading = screen.getByRole("img").getAttribute("loading");

		expect(imageLoading).toBe("lazy");
	});

	it("should add the fallback image if image path is empty", () => {
		render(<StoryblokImage src={""} alt={mockImageResponse.alt} />);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toBe("/fallback-image.png");
	});
});
