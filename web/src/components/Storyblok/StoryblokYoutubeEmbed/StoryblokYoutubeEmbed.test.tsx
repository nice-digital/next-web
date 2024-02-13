import { render, screen } from "@testing-library/react";

import {
	StoryblokYoutubeEmbed,
	StoryblokYoutubeEmbedProps,
} from "./StoryblokYoutubeEmbed";

const mockYoutubeEmbedProps: StoryblokYoutubeEmbedProps = {
	blok: {
		_uid: "123",
		component: "youtubeEmbed",
		source: "https://www.youtube.com/embed/123",
	},
};

describe("StoryblokYoutubeEmbed", () => {
	it("should render the StoryblokYoutubeEmbed component", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(screen.getByTitle("(video)")).toHaveProperty("tagName", "IFRAME");
	});

	it("should render the StoryblokYoutubeEmbed component with the correct source", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(screen.getByTitle("(video)")).toHaveAttribute(
			"src",
			mockYoutubeEmbedProps.blok.source
		);
	});

	it("should allow full screen on iframe", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(screen.getByTitle("(video)")).toHaveAttribute("allowfullscreen", "");
	});
});
