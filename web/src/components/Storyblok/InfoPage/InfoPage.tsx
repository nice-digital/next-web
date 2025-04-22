import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokSectionNav } from "@/components/Storyblok/StoryblokSectionNav/StoryblokSectionNav";
import { type ExtendedSBLink } from "@/components/Storyblok/StoryblokSectionNav/utils/Utils";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";

import styles from "./InfoPage.module.scss";

interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
	breadcrumbs?: Breadcrumb[];
	tree: ExtendedSBLink[];
	slug: string;
}

export const InfoPage = ({
	blok,
	breadcrumbs,
	tree,
	slug,
}: InfoPageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header.map((nestedBlok) => {
				return (
					<StoryblokComponent
						blok={nestedBlok}
						key={nestedBlok._uid}
						breadcrumbs={breadcrumbs}
					/>
				);
			})}

			<Grid gutter="loose">
				<GridItem cols={12} sm={{ cols: 4 }} md={{ cols: 3 }}>
					<StoryblokSectionNav tree={tree} slug={slug} />
				</GridItem>
				<GridItem cols={12} sm={{ cols: 8 }} md={{ cols: 9 }}>
					<div className={styles.content}>
						<StoryblokRichText content={blok.content} />
					</div>
				</GridItem>
			</Grid>
		</>
	);
};
