import { render, screen, waitFor } from "@testing-library/react";

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
	/**
	 * check load of poster and button
	 * check button inner span text exists and is correct
	 * on click of button check iframe is rendered
	 * check iframe has correct src
	 * check iframe has title
	 *
	 */
	it("should render the StoryblokYoutubeEmbed component", () => {
		render(<StoryblokYoutubeEmbed blok={mockYoutubeEmbedProps.blok} />);

		const wrapper = screen.getByRole("article");
		expect(wrapper).toBeInTheDocument();

		const button = screen.getByRole("button");
		console.log(button);
		expect(button).toBeInTheDocument();
	});

	it("should load the iframe on button click", async () => {
		render(<StoryblokYoutubeEmbed blok={mockYoutubeEmbedProps.blok} />);

		const button = screen.getByRole("button");
		button.click();

		await waitFor(() => {
			const embedIframe = screen.getByTitle(
				`(video) ${mockYoutubeEmbedProps.blok.title}`
			);
			expect(embedIframe).toHaveProperty("tagName", "IFRAME");
			const iframeSrc = embedIframe.getAttribute("src");
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(iframeSrc).toContain(`${mockYoutubeEmbedProps.blok.source}`);
		});
	});

	it("should render the StoryblokYoutubeEmbed iframe with the correct source", async () => {
		render(<StoryblokYoutubeEmbed blok={mockYoutubeEmbedProps.blok} />);

		const button = screen.getByRole("button");
		button.click();

		await waitFor(() => {
			const embedIframe = screen.getByTitle(
				`(video) ${mockYoutubeEmbedProps.blok.title}`
			);
			const iframeSrc = embedIframe.getAttribute("src");
			expect(iframeSrc).toContain(`${mockYoutubeEmbedProps.blok.source}`);
		});
	});

	it("should allow full screen on iframe", async () => {
		render(<StoryblokYoutubeEmbed blok={mockYoutubeEmbedProps.blok} />);

		const button = screen.getByRole("button");
		button.click();

		await waitFor(() => {
			const embedIframe = screen.getByTitle(
				`(video) ${mockYoutubeEmbedProps.blok.title}`
			);
			expect(embedIframe).toHaveAttribute("allowfullscreen", "");
		});
	});
});
