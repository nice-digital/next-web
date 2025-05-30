import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { InPageNav } from "@nice-digital/nds-in-page-nav";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

import styles from "./InfoPage.module.scss";

interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
	breadcrumbs?: Breadcrumb[];
	siblingPages?: string[];
}

export const InfoPage = ({
	blok,
	breadcrumbs,
	siblingPages,
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
				className={blok.hideSectionNav === "true" ? styles["infoPage--reverse-order"] : undefined}
			>
				{(blok.hideSectionNav !== "true" || blok.hideInPageNav !== "true") && (
					<GridItem cols={12} sm={3} className={styles.infoPage__navArea}>
						{blok.hideSectionNav !== "true" && siblingPages && (siblingPages.length > 0) ? (
								<StackedNav label="Label of parent section" elementType="h2">
									{siblingPages.map((page, index) => {
										return (
											<StackedNavLink destination="/" key={index}>
												{page}
											</StackedNavLink>
										);
									})}
								</StackedNav>
							) : (
								<InPageNav headingsSelector={"h2"}/>
							)
						}
					</GridItem>
				)}

				<GridItem cols={12} sm={{ cols: 9 }} className={styles.infoPage__contentArea}>
					<div className={styles.content}>
						<StoryblokRichText content={blok.content} />
					</div>
				</GridItem>
			</Grid>
		</div>
	);
};
