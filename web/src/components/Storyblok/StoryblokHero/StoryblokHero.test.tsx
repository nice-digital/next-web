import { screen } from "@testing-library/react";

import { render } from "@/test-utils/rendering";
import { mockImageAsset } from "@/test-utils/storyblok-data";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";

import { StoryblokHero, type HeroBlokProps } from "./StoryblokHero";

export const heroProps: HeroBlokProps = {
	blok: {
		title: "Holding out for a hero",
		image: mockImageAsset,
		_uid: "123245789",
		component: "hero",
		cta: [
			{
				_uid: "123456789",
				component: "buttonLink",
				text: "Click me",
				link: {
					_uid: "123456789",
					url: "https://example.com",
				},
				variant: "primary",
			},
		],
		summary: "The hero we need",
		description: "The hero we deserve",
	},
};

const breadcrumbs: TypeBreadcrumb[] = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "All about bacon",
		path: "/bacon",
	},
	{
		title: "Wonderful bacon additive",
		path: "/bacon/maple-syrup",
	},
];

export const heroBreadcrumbProps = {
	...heroProps,
	breadcrumbs,
};

describe("Storyblok Hero", () => {
	it("should match snapshot without breadcrumbs", () => {
		const { container } = render(<StoryblokHero {...heroProps} />);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot with breadcrumbs", () => {
		const { container } = render(<StoryblokHero {...heroBreadcrumbProps} />);
		expect(container).toMatchSnapshot();
	});

	it("should render breadcrumbs if supplied", () => {
		render(<StoryblokHero {...heroBreadcrumbProps} />);
		expect(screen.getAllByRole("link").length).toBe(breadcrumbs.length);
	});
});
