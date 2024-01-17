import { StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

import styles from "./NewsArticle.module.scss";

interface HomepageBlokProps {
	blok: NewsArticleStoryblok;
}

export const NewsArticle = ({
	blok,
}: HomepageBlokProps): React.ReactElement => {
	console.log("NewsArticle blok", blok);

	const pageHeaderBlok = {
		title: blok.title,
		summary: blok.introText,
		date: blok.date,
		_uid: blok._uid,
		component: "pageHeader",
	};

	return (
		<article>
			<StoryblokPageHeader blok={pageHeaderBlok} />

			<div className={styles.articleContainer}>
				<div className={styles.articleContent}>
					{blok.image && (
						<img
							style={{ aspectRatio: 16 / 9, width: "100%", objectFit: "cover" }}
							src={`${blok.image.filename}/m/`}
						/>
					)}

					{render(blok.content)}
				</div>
				<aside className={styles.articleSidebar}>
					<h2 className="h4">Related content</h2>
					{/* <StoryblokComponent blok={blok.relatedContent} /> */}
				</aside>
			</div>
		</article>
	);
};
