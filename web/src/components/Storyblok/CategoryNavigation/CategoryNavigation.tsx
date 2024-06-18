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
	const { metadata, pageHeader, cardGrid } = blok;

	return (
		<>
			{metadata &&
				metadata.length > 0 &&
				metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{pageHeader.map((nestedBlok) => (
				<StoryblokComponent
					blok={nestedBlok}
					breadcrumbs={breadcrumbs}
					key={nestedBlok._uid}
				/>
			))}
			{cardGrid.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
