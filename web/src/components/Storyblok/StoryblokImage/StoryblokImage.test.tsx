import { render, screen } from "@testing-library/react";

import { StoryblokImage, StoryblokImageProps } from "./StoryblokImage";

const mockImageResponse = {
	alt: "Test image alt",
	src: "https://a.storyblok.com/f/292509/805x603/292d0d5de8/nhs-team.JPG",
} as StoryblokImageProps;

describe("StoryblokImage Component", () => {
	it("should render the image with webp and jpeg ", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toContain(
			"/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F292509%2F805x603%2F292d0d5de8%2Fnhs-team.JPG%2Fm%2Ffilters%3Aformat%2528jpeg%2529%3Aquality%252880%2529&w=1920&q=75"
		);
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
				serviceOptions={{
					quality: 80,
					smart: true,
				}}
			/>
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");
		expect(imageSrc).toContain(
			"/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F292509%2F805x603%2F292d0d5de8%2Fnhs-team.JPG%2Fm%2Fsmart%2Ffilters%3Aformat%2528jpeg%2529%3Aquality%252880%2529&w=1920&q=75"
		);
	});

	it("should pull the height and width from the src if it matches the expected format", () => {
		render(
			<StoryblokImage
				src={mockImageResponse.src}
				alt={mockImageResponse.alt}
			/>
		);

		const imageHeight = screen.getByRole("img").getAttribute("height");
		const imageWidth = screen.getByRole("img").getAttribute("width");
		expect(imageHeight).toBe("603");
		expect(imageWidth).toBe("805");
	});


	it("should use the default height and the width if src doesn't match expected format", () => {
		render(
			<StoryblokImage
				src="https://placehold.co/600x400"
				alt={mockImageResponse.alt}
			/>
		);

		const imageHeight = screen.getByRole("img").getAttribute("height");
		const imageWidth = screen.getByRole("img").getAttribute("width");
		expect(imageHeight).toBe("600");
		expect(imageWidth).toBe("600");
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
		render(
			<StoryblokImage
				src={""}
				alt={mockImageResponse.alt}
				width={0}
				height={0}
			/>
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toBe("/_next/image?url=%2Ffallback-image.png&w=16&q=75");
	});
});
