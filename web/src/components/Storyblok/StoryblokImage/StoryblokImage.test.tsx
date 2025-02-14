import { render, screen } from "@testing-library/react";

import { StoryblokImage, StoryblokImageProps } from "./StoryblokImage";

const mockImageResponse = {
	alt: "Test image alt",
	src: "http://test-image.jpg",
} as StoryblokImageProps;

describe("StoryblokImage Component", () => {
	it("should render the image with webp and jpeg ", () => {
		render(
			<StoryblokImage src={mockImageResponse.src} alt={mockImageResponse.alt} />
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toContain("/_next/image?url=http%3A%2F%2Ftest-image.jpg%2Fm%2Ffilters%3Aformat%2528jpeg%2529%3Aquality%252880%2529&w=16&q=75");
		// expect(imageSrc).toBe(
		// 	mockImageResponse.src + "/m/filters:format%28jpeg%29:quality%2880%29"
		// );
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
					height: 428,
					quality: 80,
					smart: true,
					width: 760,
				}}
			/>
		);

		const imageSrc = screen.getByRole("img").getAttribute("src");
		expect(imageSrc).toContain(
			"/_next/image?url=http%3A%2F%2Ftest-image.jpg%2Fm%2F760x428%2Fsmart%2Ffilters%3Aformat%2528jpeg%2529%3Aquality%252880%2529&w=16&q=75"
		);
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
		expect(imageHeight).toBe("100");
		expect(imageWidth).toBe("100");
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
		render(<StoryblokImage src={""} alt={mockImageResponse.alt} width={0} height={0}/>);

		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toBe("/_next/image?url=%2Ffallback-image.png&w=16&q=75");
	});
});
