import { StoryblokComponent } from "@storyblok/react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { type InfoPageStoryblok } from "@/types/storyblok";

import { StoryblokSectionNav } from "../StoryblokSectionNav/StoryblokSectionNav";

import styles from "./InfoPage.module.scss";

type Link = {
	id: number;
	slug: string;
	parent_id: number;
	name: string;
	is_folder: boolean;
	is_startpage: boolean;
	real_path: string;
	childLinks?: Link[];
};

interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
	breadcrumbs?: Breadcrumb[];
	parentChildLinksTreeArray: Link[];
	parentAndSiblingLinksElse: Link[];
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
				<GridItem cols={12} sm={{ cols: 4 }} md={{ cols: 3 }}>
					<StoryblokSectionNav
						parentChildLinksTreeArray={parentChildLinksTreeArray}
						parentAndSiblingLinksElse={parentAndSiblingLinksElse}
						slug={slug}
					/>
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
