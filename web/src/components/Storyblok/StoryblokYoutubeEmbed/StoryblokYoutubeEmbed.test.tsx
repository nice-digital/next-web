import { render, screen } from "@testing-library/react";

import {
	StoryblokYoutubeEmbed,
	StoryblokYoutubeEmbedProps,
} from "./StoryblokYoutubeEmbed";

const mockYoutubeEmbedProps: StoryblokYoutubeEmbedProps = {
	blok: {
		_uid: "123",
		component: "youtubeEmbed",
		title: "test video title",
		source: "12345678910",
	},
};

describe("StoryblokYoutubeEmbed", () => {
	it("should render the StoryblokYoutubeEmbed component", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(
			screen.getByTitle(`(video) ${mockYoutubeEmbedProps.blok.title}`)
		).toHaveProperty("tagName", "IFRAME");
	});

	it("should render the StoryblokYoutubeEmbed component with the correct source", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(
			screen.getByTitle(`(video) ${mockYoutubeEmbedProps.blok.title}`)
		).toHaveAttribute(
			"src",
			`https://www.youtube.com/embed/${mockYoutubeEmbedProps.blok.source}`
		);
	});

	it("should allow full screen on iframe", () => {
		render(<StoryblokYoutubeEmbed {...mockYoutubeEmbedProps} />);

		expect(
			screen.getByTitle(`(video) ${mockYoutubeEmbedProps.blok.title}`)
		).toHaveAttribute("allowfullscreen", "");
	});
});
