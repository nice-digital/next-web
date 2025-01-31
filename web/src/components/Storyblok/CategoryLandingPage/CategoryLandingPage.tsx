import { StoryblokComponent } from "@storyblok/react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type CategoryLandingPageStoryblok } from "@/types/storyblok";

import styles from "./CategoryLandingPage.module.scss";
import { Testimonial } from "../Testimonial/shared/Testimonial";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
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
			<Testimonial
				variant="fullWidth"
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
				image={
					<StoryblokImage
						src={
							"https://a.storyblok.com/f/243782/2120x1414/589029a64d/patient-using-oximeter-at-home.jpg"
						}
						alt={"some alt text"}
						serviceOptions={{ height: 0, quality: 80, width: 708 }}
					/>
				}
			/>
			Full Width White
			<Testimonial
				variant="fullWidthWhite"
				quoteName="Jane Doe"
				quoteRole="Software Engineer"
				quoteText="This is an amazing product! Highly recommended for everyone."
				image={
					<img src="https://avatar.iran.liara.run/public" alt="Persons name" />
				}
			/>
			1 col-default
			<Grid gutter="loose">
				<GridItem cols={12}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
			</Grid>
			1 col-transparent
			<Grid gutter="loose">
				<GridItem cols={12}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						variant="transparent"
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
			</Grid>
			2 col-default
			<Grid gutter="loose">
				<GridItem cols={12} md={6}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
				<GridItem cols={12} md={6}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
			</Grid>
			3 col-transparent
			<Grid gutter="loose">
				<GridItem cols={12} md={4}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						variant="transparent"
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
				<GridItem cols={12} md={4}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						variant="transparent"
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
				<GridItem cols={12} md={4}>
					<Testimonial
						quoteName="Jane Doe"
						quoteRole="Software Engineer"
						quoteText="This is an amazing product! Highly recommended for everyone."
						variant="transparent"
						image={
							<img
								src="https://avatar.iran.liara.run/public"
								alt="Persons name"
							/>
						}
					/>
				</GridItem>
			</Grid>
		</div>
	);
};
