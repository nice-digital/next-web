import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { type FormPageStoryblok } from "@/types/storyblok";

import styles from "./FormPage.module.scss";

export interface FormPageProps {
	blok: FormPageStoryblok;
	breadcrumbs?: Breadcrumb[];
}

export const FormPage = ({
	blok,
	breadcrumbs,
}: FormPageProps): React.ReactElement => {
	const { metadata, header, content, panel } = blok;

	return (
		<div className={styles.formPage}>
			{metadata &&
				metadata.length > 0 &&
				metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{header &&
				header.map((nestedBlok) => (
					<StoryblokComponent
						blok={nestedBlok}
						key={nestedBlok._uid}
						breadcrumbs={breadcrumbs}
					/>
				))}

			<Grid gutter="loose">
				<GridItem cols={12} md={panel && panel.length > 0 ? 8 : 12}>
					{content &&
						content.map((nestedBlok) => (
							<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
						))}
				</GridItem>

				{panel && panel.length > 0 && (
					<GridItem cols={12} md={4}>
						{panel.map((nestedBlok) => (
							<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
						))}
					</GridItem>
				)}
			</Grid>
		</div>
	);
};
