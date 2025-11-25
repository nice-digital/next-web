import { StoryblokComponent } from "@storyblok/react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

import styles from "./FormPage.module.scss";

export interface CategoryLandindPageBlokProps {
	blok: CategoryLandingPageStoryblok;
	breadcrumbs?: Breadcrumb[];
}

export const FormPage = ({
	blok,
	breadcrumbs,
}: CategoryLandindPageBlokProps): React.ReactElement => {
	return (
		<div className={styles.categoryLandingPage}>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header &&
				blok.header.map((nestedBlok) => (
					<StoryblokComponent
						blok={nestedBlok}
						key={nestedBlok._uid}
						breadcrumbs={breadcrumbs}
					/>
				))}
			{blok.content &&
				blok.content.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
		</div>
	);
};
