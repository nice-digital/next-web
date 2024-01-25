import { StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

import StoryblokImage from "../StoryblokImage/StoryblokImage";

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
		pageType: blok.component,
		_uid: blok._uid,
		component: "pageHeader",
	};

	return (
		<Grid elementType="article" className={styles.article}>
			<GridItem cols={12}>
				{/* article page header */}
				<StoryblokPageHeader blok={pageHeaderBlok} />

				<Grid>
					{/* article content */}
					<GridItem cols={12} md={{ cols: 7 }}>
						{blok.image && (
							<StoryblokImage
								className={styles.featuredImage}
								src={blok.image.filename}
								alt={blok.image.alt}
							/>
						)}

						<Grid>
							<GridItem cols={12} md={{ cols: 10 }}>
								{render(blok.content, {
									defaultBlokResolver: (name, props) => {
										const blok = { ...props, component: name };
										return <StoryblokComponent blok={blok} />;
									},
								})}
							</GridItem>
						</Grid>
					</GridItem>

					{/* article sidebar */}
					<GridItem
						cols={12}
						md={{ cols: 4, push: 1 }}
						elementType="aside"
						className={styles.articleSidebar}
					>
						{blok.resources && blok.resources.length > 0 && (
							<>
								<Panel variant="primary">
									<h2>related content</h2>
								</Panel>
								<StoryblokComponent blok={blok.resources} />
							</>
						)}

						{blok.relatedNews && blok.relatedNews.length > 0 && (
							<>
								<Panel>
									<h2>Related news</h2>
								</Panel>
								<StoryblokComponent blok={blok.relatedNews} />
							</>
						)}

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
