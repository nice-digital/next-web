import { StoryblokComponent } from "@storyblok/react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

import styles from "./CategoryLandingPage.module.scss";
import { Testimonial } from "../Testimonial/Testimonial";

export interface CategoryLandindPageBlokProps {
	blok: CategoryLandingPageStoryblok;
	breadcrumbs?: Breadcrumb[];
}

export const CategoryLandingPage = ({
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
			<Testimonial
				variant="default"
				quoteText="this is my quote for testimonial component"
				quoteName="Person's Name"
				quoteRole="Role Name"
				children={undefined}
				image={"https://avatar.iran.liara.run/public"}
			/>
		</div>
	);
};
