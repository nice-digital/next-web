import { StoryblokComponent } from "@storyblok/react";

import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

import styles from "./CategoryLandingPage.module.scss";

export interface CategoryLandindPageBlokProps {
	blok: CategoryLandingPageStoryblok;
}

export const CategoryLandingPage = ({
	blok,
}: CategoryLandindPageBlokProps): React.ReactElement => {
	return (
		<div className={styles.categoryLandingPage}>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
			{blok.content &&
				blok.content.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
		</div>
	);
};
