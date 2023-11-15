import { StoryblokComponent } from "@storyblok/react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type CategoryNavigationStoryblok } from "@/types/storyblok";

interface CategoryNavigationBlokProps {
	blok: CategoryNavigationStoryblok;
	breadcrumbs: Breadcrumb[];
}

export const CategoryNavigation = ({
	blok,
	breadcrumbs,
}: CategoryNavigationBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.hero.map((nestedBlok) => (
				<StoryblokComponent
					blok={nestedBlok}
					breadcrumbs={breadcrumbs}
					key={nestedBlok._uid}
				/>
			))}
			{blok.cardGrid.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
