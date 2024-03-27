import { render } from "@/test-utils/rendering";
import { mockImageAsset } from "@/test-utils/storyblok-data";

import { HomepageHero, type HomepageHeroBlokProps } from "./HomepageHero";

export const homepageHeroProps: HomepageHeroBlokProps = {
	blok: {
		title: "Holding out for a homepage hero",
		description: "'til the end of the night",
		images: [mockImageAsset],
		cta: [
			{
				text: "Click this thing",
				link: {
					linktype: "url",
					cached_url:
						"https://www.youtube.com/watch?v=bWcASV2sey0&pp=ygUjYm9ubmllIHR5bGVyIGhvbGRpbmcgb3V0IGZvciBhIGhlcm8%3D",
					url: "https://www.youtube.com/watch?v=bWcASV2sey0&pp=ygUjYm9ubmllIHR5bGVyIGhvbGRpbmcgb3V0IGZvciBhIGhlcm8%3D",
				},
				_uid: "654654654",
				variant: "cta",
				component: "buttonLink",
			},
		],
		_uid: "123245789",
		component: "homepageHero",
	},
};

describe("Homepage Hero", () => {
	it("should match snapshot", () => {
		const { container } = render(<HomepageHero {...homepageHeroProps} />);
		expect(container).toMatchSnapshot();
	});
});
