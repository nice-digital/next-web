import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { InPageNav } from "@nice-digital/nds-in-page-nav";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokSectionNav } from "@/components/Storyblok/StoryblokSectionNav/StoryblokSectionNav";
import {
	type ExtendedSBLink,
	sectionNavIsPopulated,
} from "@/components/Storyblok/StoryblokSectionNav/utils/Utils";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

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
		<div className={styles.infoPage}>
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

			<Grid
				gutter="loose"
				className={
					!sectionNavIsPopulated(tree) || blok.hideSectionNav === "true"
						? styles["infoPage--reverse-order"]
						: undefined
				}
			>
				{((blok.hideSectionNav !== "true" && sectionNavIsPopulated(tree)) ||
					blok.hideInPageNav !== "true") && (
					<GridItem
						cols={12}
						sm={{ cols: 4 }}
						md={{ cols: 3 }}
						className={styles.infoPage__navArea}
					>
						{blok.hideSectionNav !== "true" ? (
							<StoryblokSectionNav tree={tree} slug={slug} />
						) : (
							<InPageNav headingsSelector={"h2"} />
						)}
					</GridItem>
				)}

				<GridItem
					cols={12}
					sm={{ cols: 8 }}
					md={{ cols: 9 }}
					className={styles.infoPage__contentArea}
				>
					<div className={styles.content}>
						<StoryblokRichText content={blok.content} />
					</div>
				</GridItem>
			</Grid>
		</div>
	);
};
