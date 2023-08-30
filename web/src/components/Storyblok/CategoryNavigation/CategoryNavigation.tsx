import { StoryblokComponent, ISbStoryData } from "@storyblok/react";

import { type CategoryNavigationStoryblok } from "@/types/storyblok";

interface CategoryNavigationBlokProps {
	blok: CategoryNavigationStoryblok;
	breadcrumbs: {
		stories: ISbStoryData[];
	};
}

export const CategoryNavigation = ({
	blok,
	breadcrumbs,
}: CategoryNavigationBlokProps): React.ReactElement => {
	return (
		<>
			{blok.hero.map((nestedBlok) => (
				<StoryblokComponent
					breadcrumbs={breadcrumbs}
					blok={nestedBlok}
					key={nestedBlok._uid}
				/>
			))}
			{blok.cardGrid.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
