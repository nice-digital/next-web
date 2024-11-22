import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";

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
				<GridItem cols={12} sm={{ cols: 3 }}>
					{siblingPages && siblingPages.length > 0 && (
						<StackedNav label="Label of parent section" elementType="h2">
							{siblingPages.map((page, index) => {
								return (
									<StackedNavLink destination="/" key={index}>
										{page}
									</StackedNavLink>
								);
							})}
						</StackedNav>
					)}
				</GridItem>
				<GridItem cols={12} sm={{ cols: 9 }}>
					<div className={styles.content}>
						<StoryblokRichText content={blok.content} />
					</div>
				</GridItem>
			</Grid>
		</>
	);
};
