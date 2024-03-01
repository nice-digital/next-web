import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type InfoPageStoryblok } from "@/types/storyblok";

import styles from "./InfoPage.module.scss";

interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
	siblingPages?: string[];
}

export const InfoPage = ({
	blok,
	siblingPages,
}: InfoPageBlokProps): React.ReactElement => {
	console.log({ siblingPages });
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}

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
