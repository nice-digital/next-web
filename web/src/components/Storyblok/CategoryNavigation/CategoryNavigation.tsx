import { StoryblokComponent } from "@storyblok/react";

import { type CategoryNavigationStoryblok } from "@/types/storyblok";

interface CategoryNavigationBlokProps {
	blok: CategoryNavigationStoryblok;
}

export const CategoryNavigation = ({
	blok,
}: CategoryNavigationBlokProps): React.ReactElement => {
	return (
		<>
			{blok.hero.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
			{blok.cardGrid.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
