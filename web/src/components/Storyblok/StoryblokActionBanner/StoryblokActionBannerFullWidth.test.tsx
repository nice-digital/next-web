/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokActionBannerFullWidth,
	type StoryblokActionBannerProps,
} from "./StoryblokActionBannerFullWidth";

const mockStoryblokActionBannerFullWidth: StoryblokActionBannerProps = {
	blok: {
		heading: "Mock action banner title",
		body: {
			type: "Mock rich text",
		},
		image: {
			id: 123456789,
			name: "Kittens mate.",
			filename: "https://placekitten.com/408/287",
		},
		cta: [
			{
				text: "Press me",
				link: {
					linktype: "url",
					url: "https://placekitten.com/408/287",
				},
				variant: "inverse",
				_uid: "asdfsadf",
				component: "buttonLink",
			},
		],
		_uid: "123456789",
		component: "actionBanner",
	},
};

const mockStoryblokActionBannerFullWidthSubtle: StoryblokActionBannerProps = {
	blok: {
		...mockStoryblokActionBannerFullWidth.blok,
		variant: "fullWidthSubtle",
	},
};

describe("Storyblok action banner full width component", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<StoryblokActionBannerFullWidth {...mockStoryblokActionBannerFullWidth} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot for the subtle variant", () => {
		const { container } = render(
			<StoryblokActionBannerFullWidth
				{...mockStoryblokActionBannerFullWidthSubtle}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
