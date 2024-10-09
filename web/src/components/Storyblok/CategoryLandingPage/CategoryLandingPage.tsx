import { StoryblokComponent } from "@storyblok/react";

import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

// import styles from "./CategoryLandingPage.module.scss";

interface CategoryLandindPageBlokProps {
	blok: CategoryLandingPageStoryblok;
}

export const CategoryLandingPage = ({
	blok,
}: CategoryLandindPageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
