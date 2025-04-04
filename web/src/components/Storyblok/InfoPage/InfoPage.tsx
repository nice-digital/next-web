import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";

import styles from "./InfoPage.module.scss";
import { StoryblokSectionNav } from "../StoryblokSectionNav/StoryblokSectionNav";
type ChildLink = {
	childLinks: any;
	id: number;
	real_path: string;
	slug: string;
	name: string;
};

type ParentLink = {
	id: number;
	real_path: string;
	slug: string;
	name: string;
	childLinks?: ChildLink[];
};
interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
	breadcrumbs?: Breadcrumb[];
	parentChildLinksTreeArray: ParentLink[];
	parentAndSiblingLinksElse: ChildLink[];
	slug: string;
}

export const InfoPage = ({
	blok,
	breadcrumbs,
	parentChildLinksTreeArray,
	parentAndSiblingLinksElse,
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
				<GridItem cols={12} sm={{ cols: 3 }}>
					<StoryblokSectionNav
						parentChildLinksTreeArray={parentChildLinksTreeArray}
						parentAndSiblingLinksElse={parentAndSiblingLinksElse}
						slug={slug}
					/>
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
