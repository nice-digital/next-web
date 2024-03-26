/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokActionBanner,
	type StoryblokActionBannerProps,
} from "./StoryblokActionBanner";

const mockStoryblokActionBanner: StoryblokActionBannerProps = {
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

describe("Storyblok action banner component", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<StoryblokActionBanner {...mockStoryblokActionBanner} />
		);
		expect(container).toMatchSnapshot();
	});
});
