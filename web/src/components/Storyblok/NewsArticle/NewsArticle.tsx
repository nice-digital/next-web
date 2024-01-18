import { StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

import styles from "./NewsArticle.module.scss";

interface NewsArticleProps {
	blok: NewsArticleStoryblok;
}

export const NewsArticle = ({ blok }: NewsArticleProps): React.ReactElement => {
	console.log("NewsArticle blok", blok);

	const pageHeaderBlok: PageHeaderStoryblok = {
		title: blok.title,
		summary: blok.introText,
		date: blok.date,
		_uid: blok._uid,
		component: "pageHeader",
	};

	return (
		<Grid elementType="article">
			<GridItem cols={12}>
				<StoryblokPageHeader blok={pageHeaderBlok} />

				<Grid>
					<GridItem cols={12} md={{ cols: 7 }}>
						{blok.image && (
							<img
								className={styles.featuredImage}
								src={`${blok.image.filename}/m/`}
								alt={blok.image.alt}
							/>
						)}

						{render(blok.content, {
							defaultBlokResolver: (name, props) => {
								const blok = { ...props, component: name };
								return <StoryblokComponent blok={blok} />;
							},
						})}
					</GridItem>
					<GridItem
						cols={12}
						md={{ cols: 4, push: 1 }}
						elementType="aside"
						className={styles.articleSidebar}
					>
						<h2 className="h4">Sidebar</h2>
						{/* <StoryblokComponent blok={blok.relatedContent} /> */}
					</GridItem>
				</Grid>
			</GridItem>
			<GridItem cols={12}>
				<NewsLetterSignup />
			</GridItem>
		</Grid>
	);
};
