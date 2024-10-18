/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokActionBannerDefault,
	type StoryblokActionBannerDefaultProps,
} from "./StoryblokActionBannerDefault";

const mockStoryblokActionBannerDefault: StoryblokActionBannerDefaultProps = {
	blok: {
		heading: "Mock action banner title",
		body: {
			type: "Mock rich text",
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
		component: "actionBannerDefault",
	},
};

const mockStoryblokActionBannerDefaultSubtle: StoryblokActionBannerDefaultProps =
	{
		blok: { ...mockStoryblokActionBannerDefault.blok, variant: "subtle" },
	};

describe("Storyblok action banner default component", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<StoryblokActionBannerDefault {...mockStoryblokActionBannerDefault} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match the snapshot for the subtle variant", () => {
		const { container } = render(
			<StoryblokActionBannerDefault
				{...mockStoryblokActionBannerDefaultSubtle}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
