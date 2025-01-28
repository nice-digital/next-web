import { StoryblokComponent } from "@storyblok/react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

import styles from "./CategoryLandingPage.module.scss";
import { Testimonial } from "../Testimonial/Testimonial";
import { Grid, GridItem } from "@nice-digital/nds-grid";
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

			Full Width Default
			<Testimonial variant="fullWidth" children={undefined} />

			Full Width White
			<Testimonial variant="fullWidthWhite" children={undefined} />

			1 col-subtle
			<Grid gutter="loose">
				<GridItem cols={12}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
			</Grid>
			{/* 2 col-subtle
			<Grid gutter="loose">
				<GridItem cols={6}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
				<GridItem cols={6}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
			</Grid> */}
			3 col-subtle
			<Grid gutter="loose">
				<GridItem cols={12} sm={6} md={4}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
				<GridItem cols={12} sm={6} md={4}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
				<GridItem cols={12} sm={6} md={4}>
					<Testimonial variant="subtle" children={undefined} />
				</GridItem>
			</Grid>
			{/* Column layout-default
			<Grid gutter="loose">
				1 col-default
				<GridItem cols={12}>
					<Testimonial variant="default" children={undefined} />
				</GridItem>
			</Grid>
			2 col-default
			<Grid gutter="loose">
				<GridItem cols={6} >
					<Testimonial variant="default" children={undefined} />
				</GridItem>
				<GridItem cols={6} >
					<Testimonial variant="default" children={undefined} />
				</GridItem>
			</Grid> */}
		</div>
	);
};
