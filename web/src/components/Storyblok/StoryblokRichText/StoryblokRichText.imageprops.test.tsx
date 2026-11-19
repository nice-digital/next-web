/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from "@testing-library/react";

import { type RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "./StoryblokRichText";

// Prop-preservation example tests: the derived StoryblokImage props must be
// preserved through the Figure wrapping, including the 16/9 fallback when src is
// missing (Requirements 1.2, 1.4).
//
// StoryblokImage is mocked so we can capture the props the resolver hands it,
// rather than inferring them from the transformed <picture>/<img> output.

const capturedProps: Record<string, unknown>[] = [];

jest.mock("../StoryblokImage/StoryblokImage", () => ({
	StoryblokImage: (props: Record<string, unknown>) => {
		capturedProps.push(props);
		return <img data-testid="mock-storyblok-image" alt="" />;
	},
}));

const validSrc =
	"https://a.storyblok.com/f/243782/420x234/7a576133e7/example.png";

const buildImageDoc = (attrs: {
	src?: string;
	alt?: string;
	title?: string;
}): RichtextStoryblok => ({
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [
				{
					type: "image",
					attrs: {
						id: "123",
						source: "",
						copyright: "",
						meta_data: {},
						...attrs,
					},
				},
			],
		},
	],
});

describe("StoryblokRichText - wrapping preserves the image props", () => {
	beforeEach(() => {
		capturedProps.length = 0;
	});

	it("passes the derived width/height/aspectRatio/serviceOptions for a valid src", () => {
		render(
			<StoryblokRichText
				content={buildImageDoc({ src: validSrc, alt: "An image" })}
			/>
		);

		expect(capturedProps).toHaveLength(1);
		const props = capturedProps[0];

		expect(props.src).toBe(validSrc);
		expect(props.alt).toBe("An image");
		expect(props.loading).toBe("lazy");
		expect(props.width).toBe(420);
		expect(props.height).toBe(234);
		expect(props.style).toEqual({ aspectRatio: "420/234" });
		expect(props.serviceOptions).toEqual({
			height: 0,
			width: 420,
			quality: 80,
		});
	});

	it("falls back to 16/9 dimensions when src is missing", () => {
		render(<StoryblokRichText content={buildImageDoc({ alt: "An image" })} />);

		expect(capturedProps).toHaveLength(1);
		const props = capturedProps[0];

		expect(props.width).toBe(16);
		expect(props.height).toBe(9);
		expect(props.style).toEqual({ aspectRatio: "16/9" });
		expect(props.serviceOptions).toEqual({ height: 0, width: 16, quality: 80 });
	});
});
